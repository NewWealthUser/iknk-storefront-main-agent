"use server"

import { sdk } from "@lib/config"
import { medusaGet, MedusaGetResult } from "@lib/medusa"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string): Promise<HttpTypes.StoreCart | null> {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const res = await medusaGet<{ cart: HttpTypes.StoreCart | null }>(
    `/store/carts/${id}`,
    {
      fields:
        "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
    },
    {
      cache: "no-store",
    }
  );

  if (!res.ok || !res.data?.cart) {
    console.warn(`[cart][fallback] Failed to retrieve cart '${id}': ${res.error?.message || 'Unknown error'}`);
    return null;
  }

  return res.data.cart;
}

export async function getOrSetCart(countryCode: string): Promise<HttpTypes.StoreCart | null> {
  console.log("[cart] getOrSetCart: Starting for countryCode:", countryCode);
  const region = await getRegion(countryCode)

  if (!region) {
    console.warn(`[cart][fallback] Region not found for country code: ${countryCode}. Cannot create or retrieve cart.`);
    return null;
  }
  console.log("[cart] getOrSetCart: Region found:", region.id);

  let cart = await retrieveCart()
  console.log("[cart] getOrSetCart: Initial cart from retrieveCart:", cart?.id);

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    console.log("[cart] getOrSetCart: No cart found, creating a new one.");
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    ).catch((err) => {
      console.error("[cart][error] Failed to create new cart:", medusaError(err));
      return { cart: null };
    });

    if (!cartResp.cart) {
      console.warn("[cart][fallback] Failed to create new cart. Returning null.");
      return null;
    }
    cart = cartResp.cart;

    await setCartId(cart.id)
    console.log("[cart] getOrSetCart: New cart created and ID set:", cart.id);

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    console.log("[cart] getOrSetCart: Cart region mismatch, updating cart region from", cart.region_id, "to", region.id);
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
      .catch((err) => {
        console.error("[cart][error] Failed to update cart region:", medusaError(err));
        return { cart: null };
      });
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  console.log("[cart] getOrSetCart: Final cart returned:", cart?.id);
  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart): Promise<HttpTypes.StoreCart | null> {
  const cartId = await getCartId()
  console.log("[cart] updateCart: Attempting to update cart with ID:", cartId, "with data:", data);

  if (!cartId) {
    console.warn("[cart][error] No existing cart found, cannot update.");
    return null;
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await sdk.store.cart
    .update(cartId, data, {}, headers)
    .catch((err) => {
      console.error("[cart][error] Failed to update cart:", medusaError(err));
      return { cart: null };
    });

  if (!res?.cart) {
    console.warn(`[cart][fallback] Failed to update cart '${cartId}'. Returning null.`);
    return null;
  }

  console.log("[cart] updateCart: Successfully updated cart:", res.cart.id, "Items:", res.cart.items?.length);
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const fulfillmentCacheTag = await getCacheTag("fulfillment")
  revalidateTag(fulfillmentCacheTag)

  return res.cart;
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  console.log("[cart] addToCart: Attempting to add variant:", variantId, "quantity:", quantity, "countryCode:", countryCode);
  if (!variantId) {
    throw new Error("[cart][error] Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("[cart][error] Error retrieving or creating cart. Cannot add to cart.");
  }
  console.log("[cart] addToCart: Using cart ID:", cart.id);

  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .catch((err) => {
      console.error("[cart][error] Failed to create line item:", medusaError(err));
      return { cart: null };
    });

  if (!res?.cart) {
    throw new Error("[cart][error] Failed to add item to cart.");
  }

  console.log("[cart] addToCart: Successfully created line item. New cart items count:", res.cart.items?.length);
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const fulfillmentCacheTag = await getCacheTag("fulfillment")
  revalidateTag(fulfillmentCacheTag)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  console.log("[cart] updateLineItem: Attempting to update line item:", lineId, "to quantity:", quantity);
  if (!lineId) {
    throw new Error("[cart][error] Missing lineItem ID when updating line item");
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart][error] Missing cart ID when updating line item");
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      console.log("[cart] updateLineItem: Successfully updated line item:", lineId);
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch((err) => {
      console.error("[cart][error] Failed to update line item:", medusaError(err));
      throw new Error(`[cart][error] Failed to update line item '${lineId}'.`);
    });
}

export async function deleteLineItem(lineId: string) {
  console.log("[cart] deleteLineItem: Attempting to delete line item:", lineId);
  if (!lineId) {
    throw new Error("[cart][error] Missing lineItem ID when deleting line item");
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart][error] Missing cart ID when deleting line item");
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async () => {
      console.log("[cart] deleteLineItem: Successfully deleted line item:", lineId);
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch((err) => {
      console.error("[cart][error] Failed to delete line item:", medusaError(err));
      throw new Error(`[cart][error] Failed to delete line item '${lineId}'.`);
    });
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  console.log("[cart] setShippingMethod: Setting shipping method for cart:", cartId, "method:", shippingMethodId);
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      console.log("[cart] setShippingMethod: Successfully set shipping method.");
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch((err) => {
      console.error("[cart][error] Failed to set shipping method:", medusaError(err));
      throw new Error(`[cart][error] Failed to set shipping method '${shippingMethodId}'.`);
    });
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  console.log("[cart] initiatePaymentSession: Initiating payment session for cart:", cart.id);
  const headers = {
    ...(await getAuthHeaders()),
  }

  // Corrected: Pass the cart object as the first argument, and the data as the second
  const res = await sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .catch((err) => {
      console.error("[cart][error] Failed to initiate payment session:", medusaError(err));
      // Corrected: Return an object matching the SDK's response structure on error
      return { payment_collection: null };
    });

  // Corrected: Check for payment_collection and its payment_sessions
  if (!res?.payment_collection?.payment_sessions?.[0]) {
    throw new Error("[cart][error] Failed to initiate payment session.");
  }

  console.log("[cart] initiatePaymentSession: Payment session initiated.");
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
  return res;
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()
  console.log("[cart] applyPromotions: Applying promotions for cart:", cartId, "codes:", codes);

  if (!cartId) {
    throw new Error("[cart][error] No existing cart found. Cannot apply promotions.");
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      console.log("[cart] applyPromotions: Promotions applied.");
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch((err) => {
      console.error("[cart][error] Failed to apply promotions:", medusaError(err));
      throw new Error(`[cart][error] Failed to apply promotions '${codes.join(', ')}'.`);
    });
}

export async function applyGiftCard(code: string) {
  console.log("[cart] applyGiftCard: Applying gift card:", code);
  throw new Error("[cart][error] Gift card application not yet implemented.");
}

export async function removeDiscount(code: string) {
  console.log("[cart] removeDiscount: Removing discount:", code);
  throw new Error("[cart][error] Discount removal not yet implemented.");
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
) {
  console.log("[cart] removeGiftCard: Removing gift card:", codeToRemove);
  throw new Error("[cart][error] Gift card removal not yet implemented.");
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  console.log("[cart] submitPromotionForm: Submitting promotion form with code:", code);
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

export async function setAddresses(currentState: unknown, formData: FormData) {
  console.log("[cart] setAddresses: Setting addresses with form data.");
  try {
    if (!formData) {
      throw new Error("[cart][error] No form data found when setting addresses");
    }
    const cartId = await getCartId();
    if (!cartId) {
      throw new Error("[cart][error] No existing cart found when setting addresses");
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name") as string,
        last_name: formData.get("shipping_address.last_name") as string,
        address_1: formData.get("shipping_address.address_1") as string,
        address_2: "",
        company: formData.get("shipping_address.company") as string,
        postal_code: formData.get("shipping_address.postal_code") as string,
        city: formData.get("shipping_address.city") as string,
        country_code: formData.get("shipping_address.country_code") as string,
        province: formData.get("shipping_address.province") as string,
        phone: formData.get("shipping_address.phone") as string,
      },
      email: formData.get("email") as string,
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name") as string,
        last_name: formData.get("billing_address.last_name") as string,
        address_1: formData.get("billing_address.address_1") as string,
        address_2: "",
        company: formData.get("billing_address.company") as string,
        postal_code: formData.get("billing_address.postal_code") as string,
        city: formData.get("billing_address.city") as string,
        country_code: formData.get("billing_address.country_code") as string,
        province: formData.get("billing_address.province") as string,
        phone: formData.get("billing_address.phone") as string,
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The order object if successful, or null if not.
 */
export async function placeOrder(cartId?: string): Promise<HttpTypes.StoreOrder | null> {
  const id = cartId || (await getCartId())
  console.log("[cart] placeOrder: Attempting to place order for cart ID:", id);

  if (!id) {
    throw new Error("[cart][error] No existing cart found when placing an order");
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .catch((err) => {
      // medusaError throws, so this catch block will re-throw the error
      medusaError(err);
    });

  // cartRes can be { type: "order", order: StoreOrder } or { type: "cart", cart: StoreCart }
  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()

    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    removeCartId()
    redirect(`/${countryCode}/order/${cartRes.order.id}/confirmed`)
  } else if (cartRes?.type === "cart") {
    // If it's a cart, it means the order was not completed (e.g., payment failed)
    // We should not redirect to order confirmed page, but perhaps to checkout with an error
    throw new Error("[cart][error] Order could not be completed. Cart returned instead of order.");
  }

  return null; // Should ideally not be reached if redirects or throws
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  console.log("[cart] updateRegion: Updating region to:", countryCode, "for path:", currentPath);
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`[cart][error] Region not found for country code: ${countryCode}`);
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()

  if (!cartId) {
    return null
  }

  return await medusaGet<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    cart_id: cartId,
  })
}
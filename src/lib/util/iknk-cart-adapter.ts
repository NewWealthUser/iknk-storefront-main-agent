
import { HttpTypes } from "@medusajs/types";

// Define the RH.COM-like cart structure based on our analysis of RH.COM GraphQL fragments
export interface IknkCart {
  id: string;
  items: IknkLineItem[];
  cartPrice: IknkCartPrice;
  shipAddress?: IknkAddress;
  billAddress?: IknkAddress;
  payments?: IknkPayment[];
  guest?: boolean;
  // Add other top-level cart fields as needed
  [key: string]: any; // Allow for other properties from metadata
}

export interface IknkLineItem {
  productId: string;
  sku: string;
  displayName: string;
  imageUrl: string;
  quantity: number;
  price: number; // Simplified, will map from Medusa's calculated price
  // Add other line item fields as needed
  [key: string]: any; // Allow for other properties from metadata
}

export interface IknkCartPrice {
  subtotal: number;
  tax: number;
  totalPrice: number;
  currencySymbol?: string;
  // Add other price fields like discounts
}

export interface IknkAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  company?: string;
}

export interface IknkPayment extends HttpTypes.StorePaymentSession {
  // Define payment fields as needed
  [key: string]: any;
}

export function adaptMedusaLineItemToIknkLineItem(item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem): IknkLineItem {
  return {
    id: item.id,
    productId: item.variant?.product_id || '',
    sku: item.variant?.sku || '',
    displayName: item.title,
    imageUrl: item.thumbnail || '',
    quantity: item.quantity,
    price: item.unit_price || 0,
  }
}

export function adaptMedusaCartToIknkCart(medusaCart: HttpTypes.StoreCart): IknkCart {
  const iknkCart: IknkCart = {
    id: medusaCart.id,
    items: medusaCart.items?.map(item => ({
      productId: item.product_id || '',
      sku: item.variant?.sku || '',
      displayName: item.title,
      imageUrl: item.thumbnail || '',
      quantity: item.quantity,
      price: item.unit_price || 0, // Simplified, will need to map from calculated prices
      // Map other line item properties from Medusa's item and variant
    })) || [],
    cartPrice: {
      subtotal: medusaCart.subtotal || 0,
      tax: medusaCart.tax_total || 0,
      totalPrice: medusaCart.total || 0,
      currencySymbol: medusaCart.currency_code,
      // Map discounts etc.
    },
    guest: !medusaCart.customer_id,
    // Map addresses and payments if available
    shipAddress: medusaCart.shipping_address ? {
      firstName: medusaCart.shipping_address.first_name || '',
      lastName: medusaCart.shipping_address.last_name || '',
      address1: medusaCart.shipping_address.address_1 || '',
      address2: medusaCart.shipping_address.address_2 || undefined,
      city: medusaCart.shipping_address.city || '',
      state: medusaCart.shipping_address.province || '',
      postalCode: medusaCart.shipping_address.postal_code || '',
      country: medusaCart.shipping_address.country_code || '',
      phone: medusaCart.shipping_address.phone || undefined,
      company: medusaCart.shipping_address.company || undefined,
    } : undefined,
    billAddress: medusaCart.billing_address ? {
      firstName: medusaCart.billing_address.first_name || '',
      lastName: medusaCart.billing_address.last_name || '',
      address1: medusaCart.billing_address.address_1 || '',
      address2: medusaCart.billing_address.address_2 || undefined,
      city: medusaCart.billing_address.city || '',
      state: medusaCart.billing_address.province || '',
      postalCode: medusaCart.billing_address.postal_code || '',
      country: medusaCart.billing_address.country_code || '',
      phone: medusaCart.billing_address.phone || undefined,
      company: medusaCart.billing_address.company || undefined,
    } : undefined,
    };

  // Copy other metadata fields directly if they exist
  for (const key in medusaCart.metadata) {
    if (medusaCart.metadata.hasOwnProperty(key) && iknkCart[key] === undefined) {
      try {
        const parsedValue = typeof medusaCart.metadata[key] === 'string' ? JSON.parse(medusaCart.metadata[key] as string) : medusaCart.metadata[key];
        iknkCart[key] = parsedValue;
      } catch (e) {
        iknkCart[key] = medusaCart.metadata[key];
      }
    }
  }

  console.log("adaptMedusaCartToIknkCart: Adapted cart:", JSON.stringify(iknkCart, null, 2)); // LOG
  return iknkCart;
}

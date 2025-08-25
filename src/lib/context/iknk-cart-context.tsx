"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect
} from "react";
import { HttpTypes } from "@medusajs/types";
import { retrieveCart, updateCart as medusaUpdateCart } from "@lib/data/cart"; // Medusa cart functions
import { adaptMedusaCartToIknkCart, IknkCart } from "@lib/util/iknk-cart-adapter"; // Our cart adapter
import { getCartId, setCartId } from "@lib/data/cookies"; // Our cookie functions

// Simplified placeholders for RH.COM specific hooks/utilities
const useLocale = () => "en-US";
const getCountryFromUrl = () => "US";
const countryCurrencyMapper: { [key: string]: string } = {};
const useSite = () => "default";
const useMembershipInfoAtomValue = () => ({ userHasActiveMembership: false });
const useCartProjectionAtomValue = () => ({ id: "" });
const useUserSessionAtomValue = () => ({ loading: false, loadingUpdateUserSession: false, rhUser: { userType: "", email: "" } });
const useEffectOnce = (cb: () => void, condition: boolean, deps: any[]) => {
  useEffect(() => {
    if (condition) cb();
  }, deps);
};
const useEnv = () => ({ FEATURE_CART_ID_ATOM: "false" });
const useCurrentCartIdValue = () => "";
const useDebounce = () => ({ debounce: (delay: number, cb: () => void) => setTimeout(cb, delay) });

interface UserPreferencesContextType {
  cartUpdateloading: boolean;
  cart: IknkCart | null;
  setCart: (cart: IknkCart | null) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType>({ cartUpdateloading: false, cart: null, setCart: () => {} }); // Simplified

interface IknkShoppingCartContextType {
  cartId?: string | null;
  cart: IknkCart | null;
  setCart: (cart: IknkCart | null) => void;
  loading: boolean;
  refetch: () => Promise<void>;
  handlePostalCodeCountryChange: (event: {
    postalCode: string;
    country: string;
  }) => void;
  memberShipLoading: boolean;
  setMembershipLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cartUpdateloading: boolean;
  setPromoLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const iknkShoppingCartContextDefault: IknkShoppingCartContextType = {
  cartId: null,
  cart: null,
  setCart: () => {},
  loading: true,
  refetch: async () => {},
  handlePostalCodeCountryChange: () => {},
  memberShipLoading: false,
  setMembershipLoading: () => {},
  cartUpdateloading: false,
  setPromoLoading: () => {}
};

export const IknkShoppingCartContext = createContext<IknkShoppingCartContextType>(
  iknkShoppingCartContextDefault
);

export function IknkShoppingCartContextProvider({ children }: { children: React.ReactNode }) {
  const {
    loading: loadingSession,
    loadingUpdateUserSession,
    rhUser
  } = useUserSessionAtomValue();
  const currentCartId = useCurrentCartIdValue();
  const { id: cartProjectionCartId = "" } = useCartProjectionAtomValue();
  const membershipInfo = useMembershipInfoAtomValue();
  const siteId = useSite();
  const locale = useLocale();
  const currencyCode = countryCurrencyMapper?.[getCountryFromUrl() || "US"];
  const [memberShipLoading, setMembershipLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const { cartUpdateloading, cart, setCart } = useContext(
    UserPreferencesContext
  );
  const env = useEnv();
  const FEATURE_CART_ID_ATOM = false; // Simplified yn(env?.FEATURE_CART_ID_ATOM);
  const sessionLoading = (!FEATURE_CART_ID_ATOM && loadingSession) || false;
  const { debounce } = useDebounce();
  const [cartLoading, setCartLoading] = useState(
    () => !(cart?.lineItems?.length || !Object.keys(cart || {}).length)
  );

  const cartId = useMemo(
    () => currentCartId || cartProjectionCartId,
    [cartProjectionCartId, currentCartId]
  );

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    try {
      const medusaCart = await retrieveCart(cartId || undefined);
      if (medusaCart) {
        const iknkCart = adaptMedusaCartToIknkCart(medusaCart);
        setCart(iknkCart);
        await setCartId(iknkCart.id);
      } else {
        setCart(null);
        // Optionally create a new cart if none exists
        // const newMedusaCart = await sdk.store.cart.create({ region_id: "your_region_id" });
        // setCart(adaptMedusaCartToIknkCart(newMedusaCart.cart));
        // await setCartId(newMedusaCart.cart.id);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, [cartId, setCart]);

  const refetch = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  const handlePostalCodeCountryChange = useCallback(
    async ({ postalCode, country }: { postalCode: string; country: string }) => {
      console.warn("handlePostalCodeCountryChange", { postalCode, country });
      // This would involve updating the cart's shipping address in Medusa
      // For now, just refetch the cart
      // await medusaUpdateCart({ shipping_address: { postal_code: postalCode, country_code: country } });
      await refetch();
    },
    [refetch]
  );

  useEffectOnce(
    () => {
      fetchCart();
    },
    !(
      !cartId ||
      (sessionLoading && !!cart) ||
      memberShipLoading ||
      cartUpdateloading ||
      promoLoading ||
      loadingUpdateUserSession
    ),
    [cartId, sessionLoading, cart, memberShipLoading, cartUpdateloading, promoLoading, loadingUpdateUserSession, fetchCart]
  );

  useEffect(() => {
    if (
      !(
        !cartId ||
        (sessionLoading && !!cart) ||
        memberShipLoading ||
        cartUpdateloading ||
        promoLoading ||
        loadingUpdateUserSession
      )
    ) {
      fetchCart();
    }
  }, [promoLoading, cartUpdateloading, cartId, sessionLoading, cart, memberShipLoading, loadingUpdateUserSession, fetchCart]);

  const handleSetCart = useCallback(
    (nextCart: IknkCart | null) => {
      setCart(nextCart);
    },
    [setCart]
  );

  return (
    <IknkShoppingCartContext.Provider
      value={{
        cartId,
        cart,
        setCart: handleSetCart,
        loading: cartLoading,
        refetch,
        handlePostalCodeCountryChange,
        memberShipLoading,
        setMembershipLoading,
        cartUpdateloading,
        setPromoLoading
      }}
    >
      {children}
    </IknkShoppingCartContext.Provider>
  );
}

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
import { getOrSetCart, retrieveCart, updateCart as medusaUpdateCart } from "@lib/data/cart"; // Medusa cart functions
import { adaptMedusaCartToIknkCart, IknkCart } from "@lib/util/iknk-cart-adapter"; // Our cart adapter
import { getCartId, setCartId } from "@lib/data/cookies"; // Our cookie functions

// Simplified placeholders for RH.COM specific hooks/utilities
const countryCurrencyMapper: { [key: string]: string } = {};
const useLocale = () => "en-US";
const useSite = () => "default";
const useMembershipInfoAtomValue = () => ({ userHasActiveMembership: false });
const useCartProjectionAtomValue = () => ({ id: "" });
const useUserSessionAtomValue = () => ({ loading: false, loadingUpdateUserSession: false, rhUser: { userType: "", email: "" } });

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

export function IknkShoppingCartContextProvider({ children, countryCode }: { children: React.ReactNode, countryCode: string }) {
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
  const [memberShipLoading, setMembershipLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const { cartUpdateloading, setCart } = useContext(
    UserPreferencesContext
  ); // Removed cart from destructuring to avoid direct dependency
  const env = useEnv();
  const FEATURE_CART_ID_ATOM = false; // Simplified yn(env?.FEATURE_CART_ID_ATOM);
  const sessionLoading = (!FEATURE_CART_ID_ATOM && loadingSession) || false;
  const { debounce } = useDebounce();
  const [cartLoading, setCartLoading] = useState(true); // Initialize as true to show loading state initially
  const [internalCart, setInternalCart] = useState<IknkCart | null>(null); // Use internal state for cart

  // Directly get cartId from cookies
  const [cookieCartId, setCookieCartId] = useState<string | null>(null);
  useEffect(() => {
    const fetchCookieCartId = async () => {
      const id = await getCartId();
      setCookieCartId(id || null);
    };
    fetchCookieCartId();
  }, []);

  const cartId = useMemo(
    () => cookieCartId, // Use the cartId from cookies directly
    [cookieCartId]
  );

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    try {
      const medusaCart = await getOrSetCart(countryCode);

      if (medusaCart) {
        const iknkCart = adaptMedusaCartToIknkCart(medusaCart);
        setInternalCart(iknkCart);
        setCart(iknkCart);
        await setCartId(iknkCart.id);
        setCookieCartId(iknkCart.id);
      } else {
        setInternalCart(null);
        setCart(null);
      }
    } catch (error) {
      console.error("Error in fetchCart:", error);
      setInternalCart(null);
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, [countryCode, setCart]);

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

  // Simplified useEffect to trigger fetchCart
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // useEffectOnce is removed as it prevents re-fetching
  // The logic is now handled by the simplified useEffect above.

  const handleSetCart = useCallback(
    (nextCart: IknkCart | null) => {
      setInternalCart(nextCart);
      setCart(nextCart);
    },
    [setCart]
  );

  return (
    <IknkShoppingCartContext.Provider
      value={{
        cartId,
        cart: internalCart, // Use internalCart state
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
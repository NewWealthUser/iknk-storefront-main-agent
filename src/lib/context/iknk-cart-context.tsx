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
    console.log("IknkShoppingCartContextProvider: fetchCart() called."); // LOG
    setCartLoading(true);
    console.log("IknkShoppingCartContextProvider: Attempting to fetch cart with ID:", cartId); // LOG
    try {
      const medusaCart = await retrieveCart(cartId || undefined);
      if (medusaCart) {
        const iknkCart = adaptMedusaCartToIknkCart(medusaCart);
        setInternalCart(iknkCart); // Update internal cart state
        setCart(iknkCart); // Also update context's cart state
        await setCartId(iknkCart.id);
        console.log("IknkShoppingCartContextProvider: Successfully fetched and set cart:", iknkCart); // LOG
      } else {
        setInternalCart(null); // Update internal cart state
        setCart(null); // Also update context's cart state
        console.log("IknkShoppingCartContextProvider: No cart found or retrieved."); // LOG
      }
    } catch (error) {
      console.error("IknkShoppingCartContextProvider: Error fetching cart:", error); // LOG
      setInternalCart(null); // Update internal cart state
      setCart(null); // Also update context's cart state
    } finally {
      setCartLoading(false);
    }
  }, [cartId]);

  const refetch = useCallback(async () => {
    console.log("IknkShoppingCartContextProvider: refetch() called."); // LOG
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
    // Only fetch if cartId is available or if we need to initialize
    if (cartId) {
      fetchCart();
    } else {
      // If cartId is null, ensure cart is null
      setInternalCart(null);
      setCart(null);
    }
  }, [cartId]); // Depend only on cartId

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
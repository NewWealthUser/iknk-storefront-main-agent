import { getBaseURL } from "@lib/util/env"; // Import getBaseURL

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const res = await fetch(`${getBaseURL()}/api/cookies/auth?action=getAuthHeaders`); // Use absolute URL
    if (!res.ok) return {};
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAuthHeaders: Error fetching auth headers via API:", error);
    return {};
  }
};

export const getCacheTag = async (tag: string): Promise<string> => {
  // This function is typically used in server-only contexts for revalidation tags.
  // For client-side, it might not be directly applicable or needs a different approach.
  // Keeping it as a placeholder for now.
  return "";
};

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {};
  }
  // This function is typically used in server-only contexts for revalidation tags.
  // Keeping it as a placeholder for now.
  return {};
};

export const setAuthToken = async (token: string) => {
  try {
    await fetch(`${getBaseURL()}/api/cookies/auth`, { // Use absolute URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setAuthToken", token }),
    });
  } catch (error) {
    console.error("Error setting auth token via API:", error);
  }
};

export const removeAuthToken = async () => {
  try {
    await fetch(`${getBaseURL()}/api/cookies/auth`, { // Use absolute URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeAuthToken" }),
    });
  } catch (error) {
    console.error("Error removing auth token via API:", error);
  }
};

export const getCartId = async () => {
  try {
    const res = await fetch(`${getBaseURL()}/api/cookies/auth?action=getCartId`); // Use absolute URL
    if (!res.ok) {
      console.log("getCartId: Failed to fetch cart ID from API."); // LOG
      return undefined;
    }
    const data = await res.json();
    console.log("getCartId: Retrieved cart ID from API:", data.cartId); // LOG
    return data.cartId;
  } catch (error) {
    console.error("getCartId: Error fetching cart ID via API:", error); // LOG
    return undefined;
  }
};

export const setCartId = async (cartId: string) => {
  try {
    await fetch(`${getBaseURL()}/api/cookies/auth`, { // Use absolute URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setCartId", cartId }),
    });
    console.log("setCartId: Successfully set cart ID via API:", cartId); // LOG
  } catch (error) {
    console.error("setCartId: Error setting cart ID via API:", error); // LOG
  }
};

export const removeCartId = async () => {
  try {
    await fetch(`${getBaseURL()}/api/cookies/auth`, { // Use absolute URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeCartId" }),
    });
  } catch (error) {
    console.error("Error removing cart ID via API:", error);
  }
};
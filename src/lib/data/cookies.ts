import { getBaseURL } from "@lib/util/env"; // Import getBaseURL

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const url = `${getBaseURL()}/api/cookies/auth?action=getAuthHeaders`;
    console.log("Fetching auth headers from:", url); // Added log
    const res = await fetch(url);
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
    const url = `${getBaseURL()}/api/cookies/auth`;
    console.log("Setting auth token via API to:", url); // Added log
    await fetch(url, {
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
    const url = `${getBaseURL()}/api/cookies/auth`;
    console.log("Removing auth token via API from:", url); // Added log
    await fetch(url, {
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
    const url = `${getBaseURL()}/api/cookies/auth?action=getCartId`;
    console.log("Fetching cart ID from:", url); // Added log
    const res = await fetch(url);
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
    const url = `${getBaseURL()}/api/cookies/auth`;
    console.log("Setting cart ID via API to:", url); // Added log
    await fetch(url, {
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
    const url = `${getBaseURL()}/api/cookies/auth`;
    console.log("Removing cart ID via API from:", url); // Added log
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeCartId" }),
    });
  } catch (error) {
    console.error("Error removing cart ID via API:", error);
  }
};
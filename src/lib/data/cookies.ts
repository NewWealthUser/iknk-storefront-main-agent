export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const res = await fetch("/api/cookies/auth?action=getAuthHeaders");
    if (!res.ok) return {};
    const data = await res.json();
    return data;
  } catch {
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
    await fetch("/api/cookies/auth", {
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
    await fetch("/api/cookies/auth", {
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
    const res = await fetch("/api/cookies/auth?action=getCartId");
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.cartId;
  } catch {
    return undefined;
  }
};

export const setCartId = async (cartId: string) => {
  try {
    await fetch("/api/cookies/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setCartId", cartId }),
    });
  } catch (error) {
    console.error("Error setting cart ID via API:", error);
  }
};

export const removeCartId = async () => {
  try {
    await fetch("/api/cookies/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeCartId" }),
    });
  } catch (error) {
    console.error("Error removing cart ID via API:", error);
  }
};


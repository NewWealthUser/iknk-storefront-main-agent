"use server" // This file contains server actions, so it should be marked as such.

import { getBaseURL } from "@lib/util/env";
import { cookies as nextCookies } from "next/headers";

// Helper to check if running on server (though this file is 'use server', some functions might be called from client-side wrappers)
// For functions directly using next/headers, this check is implicit.
// For functions that might be called from client-side, we'll keep the API route fetch.

// Helper to determine if the current execution context is server-side
// This is primarily for the functions that might be called from both client and server.
// For functions explicitly marked 'use server', nextCookies() is always available.
const isServerContext = typeof window === 'undefined';

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  if (isServerContext) {
    const cookieStore = nextCookies();
    const token = cookieStore.get("_medusa_jwt")?.value;
    console.log(`Server (getAuthHeaders): _medusa_jwt: ${token ? 'present' : 'missing'}`);
    return token ? { authorization: `Bearer ${token}` } : {};
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth?action=getAuthHeaders`;
      console.log("Client (getAuthHeaders): Fetching auth headers from:", url);
      const res = await fetch(url);
      if (!res.ok) return {};
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Client (getAuthHeaders): Error fetching auth headers via API:", error);
      return {};
    }
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
  if (isServerContext) {
    return { tags: [tag] };
  }
  return {};
};

export const setAuthToken = async (token: string) => {
  if (isServerContext) {
    const cookieStore = nextCookies();
    cookieStore.set("_medusa_jwt", token, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    console.log(`Server (setAuthToken): Set _medusa_jwt cookie for token: ${token ? 'present' : 'missing'}`);
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
      console.log("Client (setAuthToken): Setting auth token via API to:", url);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setAuthToken", token }),
      });
    } catch (error) {
      console.error("Client (setAuthToken): Error setting auth token via API:", error);
    }
  }
};

export const removeAuthToken = async () => {
  if (isServerContext) {
    const cookieStore = nextCookies();
    cookieStore.delete("_medusa_jwt");
    console.log('Server (removeAuthToken): Removed _medusa_jwt cookie');
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
      console.log("Client (removeAuthToken): Removing auth token via API from:", url);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeAuthToken" }),
      });
    } catch (error) {
      console.error("Client (removeAuthToken): Error removing auth token via API:", error);
    }
  }
};

export const getCartId = async () => {
  if (isServerContext) {
    const cookieStore = nextCookies();
    const cartId = cookieStore.get("_medusa_cart_id")?.value;
    console.log(`Server (getCartId): _medusa_cart_id: ${cartId ? 'present' : 'missing'}, Value: ${cartId}`);
    return cartId;
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth?action=getCartId`;
      console.log("Client (getCartId): Fetching cart ID from:", url);
      const res = await fetch(url);
      if (!res.ok) {
        console.log("Client (getCartId): Failed to fetch cart ID from API.");
        return undefined;
      }
      const data = await res.json();
      console.log("Client (getCartId): Retrieved cart ID from API:", data.cartId);
      return data.cartId;
    } catch (error) {
      console.error("Client (getCartId): Error fetching cart ID via API:", error);
      return undefined;
    }
  }
};

export const setCartId = async (cartId: string) => {
  if (isServerContext) {
    const cookieStore = nextCookies();
    cookieStore.set("_medusa_cart_id", cartId, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' ? true : false, // Explicitly false for dev, true for prod
      path: '/',
    });
    console.log(`Server (setCartId): Set _medusa_cart_id cookie for cartId: ${cartId}`);
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
      console.log("Client (setCartId): Setting cart ID via API to:", url);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setCartId", cartId }),
      });
      console.log("Client (setCartId): Successfully set cart ID via API:", cartId);
    } catch (error) {
      console.error("Client (setCartId): Error setting cart ID via API:", error);
    }
  }
};

export const removeCartId = async () => {
  if (isServerContext) {
    const cookieStore = nextCookies();
    cookieStore.delete("_medusa_cart_id");
    console.log('Server (removeCartId): Removed _medusa_cart_id cookie');
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
      console.log("Client (removeCartId): Removing cart ID via API from:", url);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeCartId" }),
      });
    } catch (error) {
      console.error("Client (removeCartId): Error removing cart ID via API:", error);
    }
  }
};
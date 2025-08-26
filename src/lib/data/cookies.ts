"use server" // This file contains server actions, so it should be marked as such.

import { getBaseURL } from "@lib/util/env";
import { cookies as nextCookies } from "next/headers";

// Helper to determine if the current execution context is server-side
const isServerContext = typeof window === 'undefined';

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  if (isServerContext) {
    const cookieStore = nextCookies(); // Corrected: call nextCookies() directly
    const token = cookieStore.get("_medusa_jwt")?.value;
    return token ? { authorization: `Bearer ${token}` } : {};
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth?action=getAuthHeaders`;
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
    const cookieStore = nextCookies(); // Corrected: call nextCookies() directly
    cookieStore.set("_medusa_jwt", token, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
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
    const cookieStore = nextCookies(); // Corrected: call nextCookies() directly
    cookieStore.delete("_medusa_jwt");
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
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
    const cookieStore = nextCookies(); // Corrected: call nextCookies() directly
    const cartId = cookieStore.get("_medusa_cart_id")?.value;
    return cartId;
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth?action=getCartId`;
      const res = await fetch(url);
      if (!res.ok) {
        return undefined;
      }
      const data = await res.json();
      return data.cartId;
    } catch (error) {
      console.error("Client (getCartId): Error fetching cart ID via API:", error);
      return undefined;
    }
  }
};

export const setCartId = async (cartId: string) => {
  if (isServerContext) {
    const cookieStore = nextCookies(); // Corrected: call nextCookies() directly
    cookieStore.set("_medusa_cart_id", cartId, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' ? true : false, // Explicitly false for dev, true for prod
      path: '/',
    });
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setCartId", cartId }),
      });
    } catch (error) {
      console.error("Client (setCartId): Error setting cart ID via API:", error);
    }
  }
};

export const removeCartId = async () => {
  if (isServerContext) {
    const cookieStore = nextCookies(); // Corrected: call nextCookies() directly
    cookieStore.delete("_medusa_cart_id");
  } else {
    try {
      const url = `${getBaseURL()}/api/cookies/auth`;
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
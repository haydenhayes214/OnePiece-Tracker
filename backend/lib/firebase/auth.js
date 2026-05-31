import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "./app.js";
import { isFirebaseConfigured } from "./config.js";

export function canUseExtensionAuth() {
  return typeof chrome !== "undefined" && Boolean(chrome.identity?.getAuthToken);
}

function getAuthTokenInteractive() {
  return new Promise((resolve, reject) => {
    const webClientId = import.meta.env.VITE_GOOGLE_OAUTH_WEB_CLIENT_ID;
    if (webClientId && chrome.identity?.launchWebAuthFlow && chrome.identity?.getRedirectURL) {
      const redirectUri = chrome.identity.getRedirectURL();
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", webClientId);
      authUrl.searchParams.set("response_type", "token");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", "openid email profile");
      authUrl.searchParams.set("prompt", "select_account");
      authUrl.searchParams.set("include_granted_scopes", "true");

      chrome.identity.launchWebAuthFlow({ url: authUrl.toString(), interactive: true }, (redirectUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!redirectUrl) {
          reject(new Error("No redirect URL returned from OAuth flow"));
          return;
        }

        const hash = new URL(redirectUrl).hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token");
        const error = params.get("error");
        if (error) {
          reject(new Error(`OAuth error: ${error}`));
          return;
        }
        if (!token) {
          reject(new Error("No auth token returned from OAuth flow"));
          return;
        }
        resolve(token);
      });
      return;
    }

    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!token) {
        reject(new Error("No auth token returned"));
        return;
      }
      resolve(token);
    });
  });
}

function removeCachedAuthToken(token) {
  return new Promise((resolve) => {
    if (!chrome.identity?.removeCachedAuthToken) {
      resolve();
      return;
    }
    chrome.identity.removeCachedAuthToken({ token }, () => resolve());
  });
}

async function clearCachedIdentityToken() {
  if (!chrome.identity?.getAuthToken || !chrome.identity?.removeCachedAuthToken) {
    return;
  }

  await new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        resolve();
        return;
      }
      await removeCachedAuthToken(token);
      resolve();
    });
  });
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add keys to frontend/.env and rebuild.");
  }
  if (!canUseExtensionAuth()) {
    throw new Error("Google sign-in only works inside the Chrome extension.");
  }

  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth failed to initialize.");

  await clearCachedIdentityToken();

  let token = await getAuthTokenInteractive();
  let credential = GoogleAuthProvider.credential(null, token);

  try {
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error) {
    if (error?.code === "auth/invalid-credential" && token) {
      await removeCachedAuthToken(token);
      token = await getAuthTokenInteractive();
      credential = GoogleAuthProvider.credential(null, token);
      const result = await signInWithCredential(auth, credential);
      return result.user;
    }
    throw error;
  }
}

export async function signOutUser() {
  const auth = getFirebaseAuth();
  if (!auth) return;

  try {
    const token = await new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive: false }, (t) => resolve(t ?? null));
    });
    if (token) await removeCachedAuthToken(token);
  } catch {
    /* ignore token cleanup errors */
  }

  await firebaseSignOut(auth);
}

export function subscribeToAuth(callback) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentFirebaseUser() {
  return getFirebaseAuth()?.currentUser ?? null;
}

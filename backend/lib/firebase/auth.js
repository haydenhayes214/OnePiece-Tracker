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

export async function signInWithGoogle() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add keys to frontend/.env and rebuild.");
  }
  if (!canUseExtensionAuth()) {
    throw new Error("Google sign-in only works inside the Chrome extension.");
  }

  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth failed to initialize.");

  const token = await getAuthTokenInteractive();
  const credential = GoogleAuthProvider.credential(null, token);
  const result = await signInWithCredential(auth, credential);
  return result.user;
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

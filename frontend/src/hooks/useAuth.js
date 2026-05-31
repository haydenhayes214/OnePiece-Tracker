import { useCallback, useEffect, useState } from "react";
import { signInWithGoogle, signOutUser, subscribeToAuth } from "@backend/lib/firebase/auth.js";
import { isFirebaseConfigured } from "@backend/lib/firebase/config.js";
import { syncAfterLogin, syncBeforeLogout } from "@backend/lib/storage.js";

export function useAuth({ onSyncComplete } = {}) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
      const merged = await syncAfterLogin();
      onSyncComplete?.(merged);
    } catch (err) {
      setError(err?.message ?? "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }, [onSyncComplete]);

  const signOut = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await syncBeforeLogout();
      await signOutUser();
      onSyncComplete?.(null);
    } catch (err) {
      setError(err?.message ?? "Sign-out failed");
    } finally {
      setBusy(false);
    }
  }, [onSyncComplete]);

  return {
    user,
    authLoading,
    busy,
    error,
    configured: isFirebaseConfigured(),
    signIn,
    signOut,
  };
}

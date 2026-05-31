# Cloud save & Google sign-in setup

## 1. Firebase project

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Add a **Web app** and copy the config values into `frontend/.env` (see `frontend/.env.example`).
3. Enable **Authentication** → Sign-in method → **Google**.
4. Create **Firestore Database** (production mode is fine).

### Firestore rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 2. Google OAuth for Chrome extension

1. Open [Google Cloud Console](https://console.cloud.google.com/) (same project as Firebase).
2. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
3. Application type: **Chrome extension**.
4. Item ID: your extension ID from `chrome://extensions` (Developer mode → One Piece Tracker).
5. Copy the client ID into `frontend/.env` as `VITE_GOOGLE_OAUTH_CLIENT_ID`.

## 3. Build & load

```bash
cp frontend/.env.example frontend/.env
# fill in all values
npm install --prefix frontend
npm run build
```

Load `backend/extension` in Chrome. Sign in with Google — progress syncs to Firestore under `users/{uid}/data/progress`.

## Episode auto-update

No setup required. The extension checks [Jikan API](https://api.jikan.moe/) daily and extends the **Elbaph** arc when new episodes are reported.

## Without Firebase

The extension still works offline with local storage only. Sign-in is hidden when Firebase env vars are missing.

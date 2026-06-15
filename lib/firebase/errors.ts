type FirebaseLikeError = {
  code?: string;
  message?: string;
};

function getFirebaseErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return "";
  return String((error as FirebaseLikeError).code ?? "");
}

export function getFirebaseErrorMessage(error: unknown, fallback: string) {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case "auth/unauthorized-domain":
      return "Firebase Auth rejected this domain. Add the GitHub Pages host in Firebase Authentication > Settings > Authorized domains.";
    case "auth/operation-not-allowed":
      return "GitHub sign-in is not enabled in Firebase Authentication.";
    case "auth/popup-blocked":
      return "The browser blocked the GitHub sign-in popup. Allow popups for this site and try again.";
    case "auth/popup-closed-by-user":
      return "GitHub sign-in was closed before completion.";
    case "auth/account-exists-with-different-credential":
      return "This email is already linked to another Firebase sign-in provider.";
    case "permission-denied":
    case "firestore/permission-denied":
      return "Firestore rejected this request. Deploy firestore.rules and confirm you are signed in with GitHub.";
    case "unavailable":
    case "firestore/unavailable":
      return "Firestore is temporarily unavailable. Check the Firebase project status and try again.";
    default:
      if (error instanceof Error && error.message) return error.message;
      return fallback;
  }
}

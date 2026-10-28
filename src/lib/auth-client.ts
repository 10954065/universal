import { createAuthClient } from "better-auth/react";

/** Browser-side auth client (same-origin). Only used on the sign-in and account pages. */
export const authClient = createAuthClient();

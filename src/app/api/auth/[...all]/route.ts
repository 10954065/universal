import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth endpoints (sign-in, sign-out, session, change-password). Sign-up is disabled in lib/auth.ts.
export const { GET, POST } = toNextJsHandler(auth);

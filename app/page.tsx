import { redirect } from "next/navigation";

/**
 * Root Route Handler:
 * TEMPORARY PLACEHOLDER ROUTER: Currently redirects directly to /customer as the Customer Portal
 * is the first reference implementation.
 * 
 * TODO (Multi-Portal Auth): When Partner and Model portals are added, replace this static redirect
 * with role-based auth middleware/landing page routing (e.g., routing customers to /customer,
 * partners to /partner, and talent models to /model based on session role).
 */
export default function RootPage() {
  redirect("/customer");
}

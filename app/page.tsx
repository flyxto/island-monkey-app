import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const ROLE_PORTALS: Record<string, string> = {
  customer: "/customer",
  partner: "/partner",
  model: "/model",
};

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const role = cookieStore.get("userRole")?.value;

  if (!token) redirect("/login");

  const portal = ROLE_PORTALS[role || ""] || "/customer";
  redirect(portal);
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getAuthUserId() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  return session?.user?.id as string | undefined;
}

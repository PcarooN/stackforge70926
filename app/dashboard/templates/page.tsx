import type { Metadata } from "next";
import { requireUser } from "../../../lib/auth/require-user";
import Catalog from "../../../components/dashboard/catalog";
export const metadata: Metadata = { title: "Concept library" };
export default async function Page() {
  await requireUser();
  return <Catalog />;
}

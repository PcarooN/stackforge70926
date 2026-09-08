import type { Metadata } from "next";
import { requireUser } from "../../../lib/auth/require-user";
import Workbench from "../../../components/product/workbench";
import "../../../components/product/product.css";
export const metadata: Metadata = { title: "Local Projects" };
export default async function ProjectsPage() {
  const { user } = await requireUser();
  return (
    <Workbench key={user.id} scope={user.id} initialView="projects" embedded />
  );
}

import type { Metadata } from "next";
import Workbench from "../../components/product/workbench";
import "../../components/product/product.css";
export const metadata: Metadata = {
  title: "Blueprint Playground | StackForge",
  description:
    "Configure, simulate, save, and export game-system blueprints in your browser. No signup required.",
};
export default function PlaygroundPage() {
  return <Workbench />;
}

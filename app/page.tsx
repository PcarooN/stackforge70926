import { getCurrentViewer } from "../lib/auth/current-user";
import Header from "../components/landing/header";
import ProductLanding from "../components/product/landing";
import "../components/product/product.css";
export const dynamic = "force-dynamic";
export default async function Home() {
  const viewer = await getCurrentViewer();
  return (
    <div
      className="forge"
      id="top"
      data-reduced-motion={viewer?.preferences.reducedMotion || undefined}
    >
      <a className="forge-skip" href="#main">
        Skip to content
      </a>
      <Header viewer={viewer} />
      <main id="main">
        <ProductLanding signedIn={!!viewer} />
      </main>
    </div>
  );
}

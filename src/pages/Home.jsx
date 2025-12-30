import Hero from "../sections/Hero";
import Categories from "../sections/Categories";
import TrendingProducts from "../sections/TrendingProducts";
import MenHighlights from "../sections/MenHighlights";
import WomenHighlights from "../sections/WomenHighlights";
import KidsHighlights from "../sections/KidsHighlights";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <TrendingProducts />
      <MenHighlights />
      <WomenHighlights />
      <KidsHighlights />
    </>
  );
}

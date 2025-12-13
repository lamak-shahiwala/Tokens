import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/NavBar";
import TopAppsSection from "@/components/sections/TopAppsSection";
import YesterdaysTopAppsSection from "@/components/sections/YesterdaysTopAppsSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full ">
      <Navbar />
      <main className="w-full flex-row justify-center items-center">
        <Header />

        <TopAppsSection />
        <YesterdaysTopAppsSection />

        {/* {<UniSwap />
        <UniswapSwapWidget />} */}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

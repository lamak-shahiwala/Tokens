import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/NavBar";
import Section from "@/components/sections/Section";
import { getRawTokens, mapToComposite } from "./lib/api";

export default async function Home() {
  // Fetch raw data on the server
  const [volRaw, mcapRaw, recentRaw] = await Promise.all([
    getRawTokens("tx-h24"),
    getRawTokens("market-cap"),
    getRawTokens("deployed-at"),
  ]);

  // Map raw tokens to CardData using your Composite Mapper
  const volApps = volRaw.map((t, i) => mapToComposite(t, i).cardData);
  const mcapApps = mcapRaw.map((t, i) => mapToComposite(t, i).cardData);
  const recentApps = recentRaw.map((t, i) => mapToComposite(t, i).cardData);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="w-full flex-row justify-center items-center">
        <Header />
        <Section title="Top apps in last 24h" apps={volApps} />
        <Section title="Top apps with highest Market Cap" apps={mcapApps} />
        <Section title="Newest Tokens" apps={recentApps} />
      </main>
      <Footer />
    </div>
  );
}

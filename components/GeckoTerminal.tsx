export default function GeckoTerminal() {
  return (
    <div className="w-full h-full lg:w-full lg:h-full p-4 rounded-[2.25rem] border overflow-hidden">
      <iframe
        id="geckoterminal-embed"
        title="GeckoTerminal Embed"
        src="https://www.geckoterminal.com/solana/pools/2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv?embed=1&info=0&swaps=0&light_chart=1&chart_type=price&resolution=5m&bg_color=FFFFFF"
        allow="clipboard-write"
        allowFullScreen
        className="w-full h-[65vh] lg:h-full px-5 py-5 rounded-2xl"
      />
    </div>
  );
}

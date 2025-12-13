export default function Header() {
  return (
    <header className="w-full flex justify-center">
      <div className="w-full max-w-6xl p-4">
        <div
          className="
            relative rounded-2xl md:rounded-3xl overflow-hidden
            h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[82vh]
          "
          style={{
            boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.9)",
          }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: "url('/images/header-cover.png')",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <div className="text-center px-4 sm:px-8 md:px-12">
              <h1
                className="
                  text-white font-title font-bold leading-tight
                  text-3xl sm:text-4xl md:text-6xl lg:text-7xl
                "
              >
                The Appcoin
                <br />
                <span className="inline-block">Launchpad.</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

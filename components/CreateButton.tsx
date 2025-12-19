import { useRouter } from "next/navigation";
import { useDropdown } from "@/hooks/useDropdown";
import { ChevronRight } from "lucide-react";

export default function CreateButton() {
  const router = useRouter();
  const { ref, open, toggle, setOpen } = useDropdown<HTMLDivElement>();

  const goToCreate = () => {
    setOpen(false);
    router.push("/create");
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger Button */}
      <div
        onClick={toggle}
        className="flex items-center justify-center px-5 py-2.5 border border-text bg-text text-bg rounded-full text-sm md:text-base hover:opacity-90 cursor-pointer select-none active:scale-95 transition-transform"
      >
        <span className="hidden md:block">+ Create</span>
        <span className="block md:hidden">Create</span>
      </div>

      {/* Dropdown Menu - Rounded corners matched to Card component */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 z-50 flex flex-col gap-2 
            p-4 sm:p-5 md:p-6 
            w-[280px] sm:w-[320px] md:w-[400px] 
            rounded-[2.5rem] lg:rounded-[3rem] 
            border border-border bg-bg shadow-xl
          "
        >
          <span className="pb-1 px-4 font-title font-semibold text-lg md:text-xl text-text text-left">
            Create an appcoin
          </span>

          {/* Option 1 */}
          <button
            onClick={goToCreate}
            className="
              w-full flex items-center justify-between 
              p-3 md:p-4 
              rounded-[1.5rem] md:rounded-[2rem] 
              border border-border bg-bg hover:bg-gray-50 transition-colors
            "
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-white p-2 rounded-xl md:rounded-2xl shadow-sm border border-black/5 shrink-0">
                <img
                  src="/images/ai.png"
                  alt="AI"
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>
              <span className="flex font-body items-center font-bold text-sm md:text-lg text-left">
                Create with
                <img
                  src="/images/minidev.png"
                  className="pl-1 h-5 md:h-7"
                  alt="minidev"
                />
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
          </button>

          {/* Option 2 */}
          <button
            onClick={goToCreate}
            className="
              w-full flex items-center justify-between 
              p-3 md:p-4 
              rounded-[1.5rem] md:rounded-[2rem] 
              border border-border bg-bg hover:bg-gray-50 transition-colors
            "
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-white p-2 rounded-xl md:rounded-2xl shadow-sm border border-black/5 shrink-0">
                <img
                  src="/images/token.png"
                  alt="Token"
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>
              <span className="font-bold font-body text-sm md:text-lg text-left">
                I already have an app
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}

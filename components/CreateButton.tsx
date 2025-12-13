export default function CreateButton() {
  return (
    <div
      className="
        flex items-center justify-center
        px-4 md:px-5
        py-2 md:py-2.5
        min-h-[40px] md:min-h-[44px]
        border border-text
        bg-text text-bg
        rounded-full
        text-sm md:text-base
        hover:border-black/85 hover:bg-black/85 hover:cursor-pointer
      "
    >
      <span className="hidden md:block">+ Create</span>
      <span className="block md:hidden">Create</span>
    </div>
  );
}

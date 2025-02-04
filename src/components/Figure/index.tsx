export default function Figure({ children }: { children: React.ReactNode }) {
  return (
    <figure className="flex flex-col overflow-auto">
      <span className="flex items-center justify-end gap-1 px-1 pb-2 text-xs">
        <div className="relative">
          <div className="size-1.5 rounded-full bg-green-500" />
          <div
            className="absolute left-0 top-0 h-full w-full animate-ping rounded-full bg-green-500"
            style={{
              animationDuration: "1.5s",
            }}
          />
        </div>
        Interactive
      </span>
      {children}
    </figure>
  );
}

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export default function Work({
  name,
  role,
  time,
  href,
  children,
}: {
  name: string;
  role: string;
  time: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      href={href}
      className="flex h-36 w-48 flex-col rounded-md bg-surface px-2 py-1.5 transition-opacity hover:opacity-75"
    >
      <div
        role="img"
        aria-label={`${name} logo`}
        className="grid flex-grow place-items-center"
      >
        {children}
      </div>
      <div className="flex items-center justify-between">
        <span>
          {role} / {time}
        </span>
        <ArrowUpRight />
      </div>
    </a>
  );
}

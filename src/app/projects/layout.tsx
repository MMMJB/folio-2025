import "@/styles/md.css";
import "highlight.js/styles/stackoverflow-light.css";

import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="size-full overflow-y-auto">
      <article className="mx-auto max-w-screen-md p-12 pt-24">
        {children}
      </article>
      <div className="mx-auto max-w-screen-md px-12 pb-12">
        <Link href="/">Return home</Link>
      </div>
    </div>
  );
}

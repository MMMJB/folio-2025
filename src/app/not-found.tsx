import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="flex size-full flex-col items-center justify-center gap-4 text-center font-serif">
      <h1 className="group text-9xl">404</h1>
      <Link href="/" className="text-highlight text-2xl">
        Return home <ArrowRight className="inline-block text-xl" />
      </Link>
    </main>
  );
}

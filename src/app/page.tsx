import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 px-4 py-32 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Discover anime through{" "}
          <span className="text-primary">studio DNA</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore the creative networks behind your favourite series. Filter by
          genre, trace studios, and build your personal vault.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/explore" className={buttonVariants({ size: "lg" })}>
          Browse Anime
        </Link>
        <Link href="/studios" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Explore Studios
        </Link>
      </div>
    </div>
  );
}

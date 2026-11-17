import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex max-w-xl flex-col gap-3">
        <p className="text-muted-foreground text-sm font-medium">Clinic workspace</p>
        <h1 className="text-4xl font-semibold tracking-tight">{siteConfig.name}</h1>
        <p className="text-muted-foreground text-base">{siteConfig.description}</p>
      </div>
      <Button asChild>
        <Link href={siteConfig.routes.login}>Sign in</Link>
      </Button>
    </main>
  );
}

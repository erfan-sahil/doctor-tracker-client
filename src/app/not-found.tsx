import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        That page is not part of {siteConfig.name}.
      </p>
      <Button asChild>
        <Link href={siteConfig.routes.home}>Back home</Link>
      </Button>
    </main>
  );
}

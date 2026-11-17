import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default function HomePage() {
  return (
    <main className="relative flex flex-1 items-center justify-center bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_oklch,var(--primary),transparent_82%),transparent)] p-4 sm:p-6">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-xl text-center">
        <CardHeader className="gap-3">
          <CardDescription>Clinic workspace</CardDescription>
          <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.name}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {siteConfig.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center px-4 pb-6 sm:px-6">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={siteConfig.routes.dashboard}>Open dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

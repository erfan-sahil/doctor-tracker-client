import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardDescription>Clinic workspace</CardDescription>
          <CardTitle className="text-4xl font-semibold tracking-tight">
            {siteConfig.name}
          </CardTitle>
          <CardDescription className="text-base">
            {siteConfig.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href={siteConfig.routes.dashboard}>Open dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

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

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md min-w-0 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>That page is not part of {siteConfig.name}.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center px-4 sm:px-6">
          <Button asChild className="w-full sm:w-auto">
            <Link href={siteConfig.routes.login}>Back to sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

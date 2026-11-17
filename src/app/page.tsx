import { redirect } from "next/navigation";

import { siteConfig } from "@/shared/config/site";

export default function RootPage() {
  redirect(siteConfig.routes.login);
}
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logout } from "@/features/auth/api/auth-api";
import { useSessionStore } from "@/features/auth/model/session-store";
import { getQueryClient } from "@/shared/lib/query/client";
import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const clearSession = useSessionStore((state) => state.clearSession);
  const user = useSessionStore((state) => state.user);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      getQueryClient().removeQueries({ queryKey: ["auth"] });
      router.replace(siteConfig.routes.login);
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 px-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="text-muted-foreground truncate text-xs">{user.email}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
      >
        <LogOut className="group-data-[collapsible=icon]:mr-0" />
        <span className="group-data-[collapsible=icon]:hidden">
          {logoutMutation.isPending ? "Signing out…" : "Sign out"}
        </span>
      </Button>
    </div>
  );
}
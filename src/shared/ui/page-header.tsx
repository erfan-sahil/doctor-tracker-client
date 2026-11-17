import { cn } from "@/shared/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("flex min-w-0 flex-col gap-1", className)}>
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
      {description ? (
        <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
      ) : null}
    </header>
  );
}
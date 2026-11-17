"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { toCreateDoctorInput } from "@/features/doctors/lib/to-create-doctor-input";
import { useCreateDoctorMutation } from "@/features/doctors/mutations/use-create-doctor";
import {
  createDoctorSchema,
  type CreateDoctorFormValues,
} from "@/features/doctors/model/create-doctor-schema";
import { ApiRequestError } from "@/shared/lib/api/errors";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { DialogScrollArea } from "@/shared/ui/scroll-area";

type CreateDoctorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: CreateDoctorFormValues = {
  name: "",
  email: "",
  password: "",
  specialization: "",
  hospital: "",
};

const dialogHeaderClassName = cn(
  "gap-2 border-b border-primary/22 px-6 py-5 text-left",
  "bg-[color-mix(in_oklch,var(--primary),var(--background)_86%)]",
  "dark:border-primary/20 dark:bg-[color-mix(in_oklch,var(--card),var(--primary)_9%)]",
);

const dialogBodyClassName = "flex flex-col gap-5 px-6 py-5 pr-3";

const dialogFooterClassName =
  "mx-0 mb-0 gap-3 border-t bg-muted/50 px-6 py-4 sm:flex-row sm:justify-end";

const fieldPasswordClassName =
  "h-8 rounded-lg border-input bg-transparent px-2.5 py-1 pr-11 text-sm shadow-none md:text-sm";

function applyCreateDoctorError(
  error: unknown,
  setError: ReturnType<typeof useForm<CreateDoctorFormValues>>["setError"],
) {
  if (!(error instanceof ApiRequestError)) {
    setError("root", { message: "Unable to create doctor. Try again." });
    return;
  }

  if (error.status === 409) {
    setError("email", { message: error.message });
    return;
  }

  setError("root", { message: error.message });
}

export function CreateDoctorDialog({ open, onOpenChange }: CreateDoctorDialogProps) {
  const form = useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const { reset, setError, clearErrors, formState } = form;
  const rootError = formState.errors.root?.message;

  const createMutation = useCreateDoctorMutation();

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  const onSubmit = form.handleSubmit(async (values) => {
    clearErrors("root");

    try {
      await createMutation.mutateAsync(toCreateDoctorInput(values));
      reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      applyCreateDoctorError(error, setError);
    }
  });

  const pending = createMutation.isPending;

  const handleOpenChange = (next: boolean) => {
    if (pending) {
      return;
    }

    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className={cn(dialogHeaderClassName, "shrink-0")}>
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            New doctor
          </p>
          <DialogTitle className="text-lg font-semibold tracking-tight">Add doctor</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
            Create a doctor account with login credentials for the clinic roster.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <DialogScrollArea>
              <div className={dialogBodyClassName}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="new-password"
                        disabled={pending}
                        className={fieldPasswordClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization (optional)</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="organization-title"
                        placeholder="e.g. Cardiology"
                        disabled={pending}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital (optional)</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="organization"
                        placeholder="e.g. City General Hospital"
                        disabled={pending}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {rootError ? (
                <p
                  className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
                  role="alert"
                >
                  {rootError}
                </p>
              ) : null}
              </div>
            </DialogScrollArea>

            <DialogFooter
              showCloseButton={false}
              className={cn(dialogFooterClassName, "shrink-0")}
            >
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Create doctor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import { zodResolver } from "@hookform/resolvers/zod";
import { t, Trans } from "@lingui/macro";
import { registerSchema } from "@reactive-resume/dto";
import { usePasswordToggle } from "@reactive-resume/hooks";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import type { z } from "zod";

import { useRegister } from "@/client/services/auth";
import { useFeatureFlags } from "@/client/services/feature";

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const { register, loading } = useRegister();

  const formRef = useRef<HTMLFormElement>(null);
  usePasswordToggle(formRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      locale: "en-US",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await register(data);

      void navigate("/auth/verify-email");
    } catch {
      form.reset();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Helmet>
        <title>
          {t`Create a new account`} - {t`Reactive Resume`}
        </title>
      </Helmet>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <img
                src="/logo/light.svg"
                alt={t`Reactive Resume Logo`}
                className="size-10 dark:hidden"
              />
              <img
                src="/logo/dark.svg"
                alt={t`Reactive Resume Logo`}
                className="hidden size-10 dark:block"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{t`Create account`}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t`Start building your professional resume today.`}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {flags.isSignupsDisabled && (
            <Alert variant="error">
              <AlertTitle>{t`Signups are currently disabled by the administrator.`}</AlertTitle>
            </Alert>
          )}

          <div className={cn(flags.isSignupsDisabled && "pointer-events-none select-none blur-sm")}>
            <Form {...form}>
              <form
                ref={formRef}
                className="flex flex-col gap-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t`Name`}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t({
                            message: "John Doe",
                            context:
                              "Localized version of a placeholder name. For example, Max Mustermann in German or Jan Kowalski in Polish.",
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t`Username`}</FormLabel>
                      <FormControl>
                        <Input
                          className="lowercase"
                          placeholder={t({
                            message: "john.doe",
                            context:
                              "Localized version of a placeholder username. For example, max.mustermann in German or jan.kowalski in Polish.",
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t`Email`}</FormLabel>
                      <FormControl>
                        <Input
                          className="lowercase"
                          placeholder={t({
                            message: "john.doe@example.com",
                            context:
                              "Localized version of a placeholder email. For example, max.mustermann@example.de in German or jan.kowalski@example.pl in Polish.",
                          })}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t`Password`}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        <Trans>
                          Hold <code className="text-xs font-bold">Ctrl</code> to display your
                          password temporarily.
                        </Trans>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={loading} className="mt-4 w-full">
                  {t`Sign up`}
                </Button>
              </form>
            </Form>
          </div>

          <div className="relative my-4">
            <Separator className="absolute inset-0" />
            <span className="bg-card text-muted-foreground relative mx-auto flex justify-center px-2 text-xs">
              {t`OR CONTINUE WITH`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Trans>Google</Trans>
            </Button>
            <Button variant="outline" className="w-full">
              <Trans>GitHub</Trans>
            </Button>
          </div>

          <div className="text-muted-foreground text-center text-sm">
            <span>{t`Already have an account?`}</span>{" "}
            <Button asChild variant="link" className="h-auto p-0">
              <Link to="/auth/login">{t`Sign in now`}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

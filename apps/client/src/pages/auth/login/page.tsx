import { zodResolver } from "@hookform/resolvers/zod";
import { t, Trans } from "@lingui/macro";
import { loginSchema } from "@reactive-resume/dto";
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
import { Link } from "react-router";
import type { z } from "zod";

import { useLogin } from "@/client/services/auth";
import { useFeatureFlags } from "@/client/services/feature";

type FormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login, loading } = useLogin();
  const { flags } = useFeatureFlags();

  const formRef = useRef<HTMLFormElement>(null);
  usePasswordToggle(formRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data);
    } catch {
      form.reset();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Helmet>
        <title>
          {t`Sign in to your account`} - {t`Reactive Resume`}
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
              <CardTitle className="text-2xl font-bold">{t`Sign in`}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t`Welcome back! Enter your credentials to continue.`}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          {flags.isEmailAuthDisabled && (
            <Alert variant="error">
              <AlertTitle>{t`Signing in via email is currently disabled by the administrator.`}</AlertTitle>
            </Alert>
          )}

          <div
            className={cn(flags.isEmailAuthDisabled && "pointer-events-none select-none blur-sm")}
          >
            <Form {...form}>
              <form
                ref={formRef}
                className="flex flex-col gap-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t`Email`}</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="email"
                          className="lowercase"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t`You can also enter your username.`}</FormDescription>
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
                        <Input type="password" autoComplete="password" {...field} />
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

                <div className="flex items-center justify-between pt-2">
                  <Button asChild variant="link" className="h-auto px-0">
                    <Link to="/auth/forgot-password">{t`Forgot Password?`}</Link>
                  </Button>

                  <Button type="submit" disabled={loading} className="px-6">
                    {t`Sign in`}
                  </Button>
                </div>
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
            <span>{t`Don't have an account?`}</span>{" "}
            <Button asChild variant="link" className="h-auto p-0">
              <Link to="/auth/register">{t`Create one now`}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

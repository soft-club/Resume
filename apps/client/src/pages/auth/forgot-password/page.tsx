import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { ArrowLeft } from "@phosphor-icons/react";
import { forgotPasswordSchema } from "@reactive-resume/dto";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import type { z } from "zod";

import { useForgotPassword } from "@/client/services/auth";

type FormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { forgotPassword, loading } = useForgotPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    await forgotPassword(data);

    setSubmitted(true);
    form.reset();
  };

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Helmet>
          <title>
            {t`You've got mail!`} - {t`Reactive Resume`}
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
                <CardTitle className="text-2xl font-bold">{t`Email sent`}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {t`Check your inbox for reset instructions.`}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-4">
            <Alert variant="success">
              <AlertDescription className="pt-0">
                {t`A password reset link should have been sent to your inbox, if an account existed with the email you provided.`}
              </AlertDescription>
            </Alert>

            <Button
              className="w-full"
              onClick={() => {
                void navigate("/auth/login");
              }}
            >
              {t`Back to Login`}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Helmet>
        <title>
          {t`Forgot your password?`} - {t`Reactive Resume`}
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
              <CardTitle className="text-2xl font-bold">{t`Reset password`}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t`Enter your email to receive reset instructions.`}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Email`}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        autoComplete="email"
                        className="lowercase"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex items-center justify-between gap-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    void navigate(-1);
                  }}
                >
                  <ArrowLeft size={14} className="mr-2" />
                  <span>{t`Back`}</span>
                </Button>

                <Button type="submit" disabled={loading} className="flex-1">
                  {t`Send Email`}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

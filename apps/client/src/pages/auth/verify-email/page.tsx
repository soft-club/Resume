import { t, Trans } from "@lingui/macro";
import { ArrowRight, Info, SealCheck } from "@phosphor-icons/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@reactive-resume/ui";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router";

import { useToast } from "@/client/hooks/use-toast";
import { queryClient } from "@/client/libs/query-client";
import { useVerifyEmail } from "@/client/services/auth";

export const VerifyEmailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail, loading } = useVerifyEmail();

  useEffect(() => {
    const handleVerifyEmail = async (token: string) => {
      await verifyEmail({ token });
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      toast({
        variant: "success",
        icon: <SealCheck size={16} weight="bold" />,
        title: t`Your email address has been verified successfully.`,
      });

      void navigate("/dashboard/resumes", { replace: true });
    };

    if (!token) return;

    void handleVerifyEmail(token);
  }, [token, navigate, verifyEmail]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Helmet>
        <title>
          {t`Verify your email address`} - {t`Reactive Resume`}
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
              <CardTitle className="text-2xl font-bold">{t`Verify email`}</CardTitle>
              <p className="text-muted-foreground text-sm">
                <Trans>
                  You should have received an email from <strong>Reactive Resume</strong> with a
                  verification link.
                </Trans>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-4">
          <Alert variant="info">
            <Info size={18} />
            <AlertTitle>{t`Please note that this step is completely optional.`}</AlertTitle>
            <AlertDescription>
              {t`We verify your email address only to ensure that we can send you a password reset link in case you forget your password.`}
            </AlertDescription>
          </Alert>

          <Button asChild disabled={loading} className="w-full">
            <Link to="/dashboard">
              {t`Go to Dashboard`}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

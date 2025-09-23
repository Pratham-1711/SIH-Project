import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormScreen from "@/components/auth/FormScreen";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get("email") || "your email";
  const navigate = useNavigate();

  return (
    <FormScreen title="Verify your email" progress={60}
      bottom={<p className="text-xs text-muted-foreground">Didn'" + "t receive the email? Check your spam folder or click Resend.</p>}
    >
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">We sent a verification link to <span className="font-medium">{email}</span>. Click the link to continue.</p>
        <div className="grid gap-2">
          <Button className="h-12 rounded-full" onClick={() => navigate("/auth/phone")}>
            I'" + "ve verified my email
          </Button>
          <Button variant="outline" className="h-12 rounded-full" onClick={() => alert("Resent!")}>Resend email</Button>
        </div>
      </div>
    </FormScreen>
  );
}

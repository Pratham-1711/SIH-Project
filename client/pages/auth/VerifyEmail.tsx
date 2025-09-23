import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormScreen from "@/components/auth/FormScreen";
import { auth, db, serverTimestamp } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { userStore } from "@/data/user";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const emailParam = params.get("email") || "";
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const href = window.location.href;
    if (!isSignInWithEmailLink(auth, href)) return;
    const stored = localStorage.getItem("emailForSignIn") || emailParam;
    if (!stored) return;
    setProcessing(true);
    (async () => {
      try {
        const cred = await signInWithEmailLink(auth, stored, href);
        const u = cred.user;
        const pendingRaw = localStorage.getItem("app:pendingUser");
        const pending = pendingRaw ? (JSON.parse(pendingRaw) as { first?: string; last?: string; phone?: string; email?: string }) : {};

        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            user_id: u.uid,
            name: `${pending.first || ""} ${pending.last || ""}`.trim() || u.displayName || "",
            phone: pending.phone || "",
            email: u.email || stored,
            role: "citizen",
            joined_at: serverTimestamp(),
          });
        }

        userStore.save({ id: u.uid, first: pending.first, last: pending.last, email: u.email || stored, phone: pending.phone, role: "citizen" });
        localStorage.setItem("app:promptLocation", "1");
        localStorage.removeItem("emailForSignIn");
        localStorage.removeItem("app:pendingUser");
        toast({ title: "Verified", description: "Email verified successfully." });
        navigate("/");
      } catch (err: any) {
        toast({ title: "Verification failed", description: String(err?.message ?? err) });
      } finally {
        setProcessing(false);
      }
    })();
  }, [navigate, emailParam]);

  async function resend() {
    const to = emailParam || localStorage.getItem("emailForSignIn") || "";
    if (!to) return;
    try {
      const actionCodeSettings = { url: `${window.location.origin}/auth/verify-email?email=${encodeURIComponent(to)}`, handleCodeInApp: true } as const;
      await sendSignInLinkToEmail(auth, to, actionCodeSettings);
      toast({ title: "Resent", description: `Link sent to ${to}` });
    } catch (err: any) {
      toast({ title: "Failed to resend", description: String(err?.message ?? err) });
    }
  }

  return (
    <FormScreen title="Verify your email" progress={60}
      bottom={<p className="text-xs text-muted-foreground">Didn't receive the email? Check spam or click Resend.</p>}
    >
      <div className="grid gap-4">
        <p className="text-sm text-muted-foreground">We sent a verification link to <span className="font-medium">{emailParam || "your email"}</span>. Click the link in your email to continue.</p>
        <div className="grid gap-2">
          <Button className="h-12 rounded-full" disabled={processing} onClick={() => window.location.reload()}>
            I've clicked the link
          </Button>
          <Button variant="outline" className="h-12 rounded-full" disabled={processing} onClick={resend}>Resend email</Button>
        </div>
      </div>
    </FormScreen>
  );
}

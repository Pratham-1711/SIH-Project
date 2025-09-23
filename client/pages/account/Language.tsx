import MobileShell from "@/components/layout/MobileShell";
import { settingsStore } from "@/data/user";

const LANGS = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
];

export default function Language() {
  const s = settingsStore.get();

  const change = (code: string) => {
    const next = { ...s, language: code };
    settingsStore.save(next);
    try { localStorage.setItem("app:language", code); } catch {}
    alert(`Language set to ${LANGS.find(l=>l.code===code)?.name}`);
  };

  return (
    <MobileShell>
      <h1 className="mb-4 text-2xl font-bold">Language</h1>
      <ul className="rounded-xl border bg-card">
        {LANGS.map((l) => (
          <li key={l.code}>
            <button onClick={()=>change(l.code)} className="flex w-full items-center justify-between px-4 py-4 hover:bg-accent">
              <span>{l.name}</span>
              <span className="text-sm text-muted-foreground">{s.language === l.code ? "Selected" : "Select"}</span>
            </button>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}

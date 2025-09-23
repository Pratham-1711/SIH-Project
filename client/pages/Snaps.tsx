import MobileShell from "@/components/layout/MobileShell";
import { snapsStore, SnapItem } from "@/data/snaps";
import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Clock, CheckCircle2 } from "lucide-react";

export default function Snaps() {
  const [items, setItems] = useState<SnapItem[]>([]);

  useEffect(() => {
    snapsStore.seedIfEmpty();
    setItems(snapsStore.all());
  }, []);

  return (
    <MobileShell>
      <h1 className="mb-3 text-2xl font-bold">My Snaps</h1>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="rounded-2xl border bg-card">
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(it.createdAt).toLocaleString()}</span>
                  <Status status={it.status} />
                </div>
                <h3 className="mt-1 text-base font-semibold">{it.title}</h3>
                <p className="text-sm text-muted-foreground">{it.description}</p>
              </div>
              {it.image ? (
                <div className="mx-4 mb-3 overflow-hidden rounded-xl">
                  <img src={it.image} alt="" className="aspect-[16/9] w-full object-cover"/>
                </div>
              ) : null}
              <div className="px-4 pb-4 text-xs text-muted-foreground">{it.location}</div>
            </li>
          ))}
        </ul>
      )}
    </MobileShell>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-sm rounded-2xl border bg-card p-8 text-center">
      <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-secondary">
        <BadgeCheck className="size-5 text-primary" />
      </div>
      <h2 className="text-lg font-semibold">No snaps yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">Use the camera button below to create your first snap.</p>
    </div>
  );
}

function Status({ status }: { status: SnapItem["status"] }) {
  const map = useMemo(
    () => ({
      submitted: { label: "Submitted", icon: <Clock className="size-4 text-primary" /> },
      in_progress: { label: "In progress", icon: <Clock className="size-4 text-primary" /> },
      resolved: { label: "Resolved", icon: <CheckCircle2 className="size-4 text-green-600" /> },
    }),
    [],
  );
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1">{s.icon} {s.label}</span>
  );
}

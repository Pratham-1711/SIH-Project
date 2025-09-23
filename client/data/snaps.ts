export type SnapStatus = "submitted" | "in_progress" | "resolved";

export interface SnapItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  createdAt: number;
  status: SnapStatus;
  location?: string;
  image?: string; // data URL or path
  repostOf?: { title: string; blurb?: string };
}

const KEY = "app:snaps";

export const snapsStore = {
  all(): SnapItem[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw) as SnapItem[];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  },
  save(list: SnapItem[]) {
    localStorage.setItem(KEY, JSON.stringify(list));
  },
  add(item: SnapItem) {
    const list = snapsStore.all();
    list.unshift(item);
    snapsStore.save(list);
  },
  seedIfEmpty() {
    const list = snapsStore.all();
    if (list.length === 0) {
      snapsStore.save([
        {
          id: crypto.randomUUID(),
          title: "Graffiti - General",
          category: "Graffiti",
          description: "Tagging on lane wall near cafe entrance.",
          createdAt: Date.now() - 1000 * 60 * 60 * 5,
          status: "submitted",
          location: "Near you",
          image: "/placeholder.svg",
        },
        {
          id: crypto.randomUUID(),
          title: "Dumped Rubbish",
          category: "Rubbish",
          description: "Couch dumped on nature strip.",
          createdAt: Date.now() - 1000 * 60 * 60 * 26,
          status: "in_progress",
          location: "CBD",
          image: "/placeholder.svg",
        },
      ]);
    }
  },
};

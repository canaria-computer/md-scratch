import { useLiveQuery } from "dexie-react-hooks";
import { db, type Memo } from "../lib/db";

export function useMemoList() {
  const memos = useLiveQuery(() =>
    db.memos.orderBy("updatedAt").reverse().toArray()
  );
  return memos;
}

export function useMemo(id: string | undefined) {
  const memo = useLiveQuery(() => (id ? db.memos.get(id) : undefined), [id]);
  return memo;
}

export async function createMemo(): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date();
  await db.memos.add({
    id,
    content: "",
    title: "名称未設定",
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateMemo(
  id: string,
  updates: Partial<Pick<Memo, "content" | "title">>,
) {
  await db.memos.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteMemo(id: string) {
  await db.memos.delete(id);
}

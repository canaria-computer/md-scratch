import Dexie, { type Table } from "dexie";

export interface Memo {
  id: string;
  content: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MdScratchDB extends Dexie {
  memos!: Table<Memo>;

  constructor() {
    super("md-scratch");
    this.version(1).stores({
      memos: "id, updatedAt, createdAt",
    });
  }
}

export const db = new MdScratchDB();

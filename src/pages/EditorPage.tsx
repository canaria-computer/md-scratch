import { useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ActionBar } from "../components/ActionBar";
import { Editor } from "../components/Editor";
import { Toolbar } from "../components/Toolbar";
import {
  createMemo,
  updateMemo,
  useMemo as useMemoData,
  useMemoList,
} from "../hooks/useMemos";
import { editorExtensions } from "../lib/editor";

export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const memo = useMemoData(id);
  const memos = useMemoList();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const memoIdRef = useRef(id);

  useEffect(() => {
    memoIdRef.current = id;
  }, [id]);

  // If no ID specified, redirect to most recent memo or create one
  useEffect(() => {
    if (id) return;

    if (memos === undefined) return; // still loading

    if (memos.length > 0) {
      navigate(`/memo/${memos[0].id}`, { replace: true });
    } else {
      createMemo().then((newId) => {
        navigate(`/memo/${newId}`, { replace: true });
      });
    }
  }, [id, memos, navigate]);

  const handleUpdate = useCallback(
    ({ editor: e }: { editor: ReturnType<typeof useEditor> }) => {
      if (!e) return;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const currentId = memoIdRef.current;
        if (!currentId) return;

        const json = JSON.stringify(e.getJSON());

        // Extract title from first H1
        let title = "名称未設定";
        const doc = e.getJSON() as any;
        if (doc.content) {
          for (const node of doc.content) {
            if (node.type === "heading" && node.attrs?.level === 1) {
              title = node.content?.map((c: any) => c.text ?? "").join("") ||
                "名称未設定";
              break;
            }
          }
        }

        void updateMemo(currentId, {
          content: json,
          title: title || "名称未設定",
        });
      }, 300);
    },
    [],
  );

  // Single Editor instance for Toolbar, ActionBar, and Editor component
  const editor = useEditor(
    {
      extensions: editorExtensions,
      content: memo?.content ? JSON.parse(memo.content) : undefined,
      onUpdate: handleUpdate,
      editorProps: {
        attributes: {
          class:
            "prose prose-invert prose-p:my-2 max-w-none focus:outline-none p-6 md:p-8 lg:p-12 min-h-full",
        },
      },
    },
    [id, memo?.id],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Waiting for data
  if (!id || memo === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted">
        <span className="icon-[mdi--loading] animate-spin text-2xl mr-2" />
        読み込み中…
      </div>
    );
  }

  // Memo not found (deleted externally)
  if (memo === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-2">
        <span className="icon-[mdi--file-question-outline] text-4xl" />
        <p>メモが見つかりません</p>
      </div>
    );
  }

  return (
    <>
      <Toolbar editor={editor} className="print:hidden" />
      <Editor editor={editor} />
      <ActionBar editor={editor} memoId={id} className="print:hidden" />
    </>
  );
}

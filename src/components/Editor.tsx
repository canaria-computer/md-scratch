import { type Editor as TiptapEditor, EditorContent } from "@tiptap/react";

interface EditorProps {
  editor: TiptapEditor | null;
}

export function Editor({ editor }: EditorProps) {
  if (!editor) return null;

  return (
    <div
      className="flex-1 overflow-y-auto print:overflow-visible"
      id="editor-container"
    >
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
}

export type { EditorProps };

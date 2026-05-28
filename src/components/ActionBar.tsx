import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface ActionBarProps {
  editor: Editor | null;
  memoId?: string;
  className?: string;
}

export function ActionBar({ editor, memoId, className }: ActionBarProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleDelete = () => {
    if (!memoId) return;
    navigate(`/memo/${memoId}/delete`);
  };

  const handleCopyMarkdown = async () => {
    if (!editor) return;
    const markdown = (editor.storage as any).markdown.getMarkdown() as string;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMd = () => {
    if (!editor) return;
    const markdown = (editor.storage as any).markdown.getMarkdown() as string;

    // Extract title for filename
    let filename = "memo";
    const doc = editor.getJSON() as any;
    if (doc.content) {
      for (const node of doc.content) {
        if (node.type === "heading" && node.attrs?.level === 1) {
          const text =
            node.content?.map((c: any) => c.text ?? "").join("") ?? "";
          if (text) {
            // Sanitize filename
            filename = text.replace(/[\\/:*?"<>|]/g, "_").slice(0, 50);
          }
          break;
        }
      }
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!editor) return null;

  return (
    <div
      className={`
				flex items-center justify-end gap-1 px-3 py-1.5
				bg-bg-secondary border-t border-border
				${className ?? ""}
			`}
      id="action-bar"
    >
      {/* Copy as Markdown */}
      <button
        type="button"
        onClick={handleCopyMarkdown}
        className="
					flex items-center gap-1.5 px-3 py-2 rounded-md text-sm
					text-text-secondary hover:text-text-primary hover:bg-bg-hover
					transition-colors cursor-pointer
				"
        title="Markdown としてコピー"
      >
        <span
          className={`text-base ${
            copied
              ? "icon-[mdi--check] text-success"
              : "icon-[mdi--content-copy]"
          }`}
        />
        <span className="hidden sm:inline">
          {copied ? "コピー済み" : "コピー"}
        </span>
      </button>

      {/* Export .md */}
      <button
        type="button"
        onClick={handleExportMd}
        className="
					flex items-center gap-1.5 px-3 py-2 rounded-md text-sm
					text-text-secondary hover:text-text-primary hover:bg-bg-hover
					transition-colors cursor-pointer
				"
        title=".md ファイルとして保存"
      >
        <span className="icon-[mdi--download] text-base" />
        <span className="hidden sm:inline">保存</span>
      </button>

      {/* Print */}
      <button
        type="button"
        onClick={handlePrint}
        className="
					flex items-center gap-1.5 px-3 py-2 rounded-md text-sm
					text-text-secondary hover:text-text-primary hover:bg-bg-hover
					transition-colors cursor-pointer
				"
        title="印刷 / PDF出力 (Ctrl+P)"
      >
        <span className="icon-[mdi--printer] text-base" />
        <span className="hidden sm:inline">印刷</span>
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={!memoId}
        className="
				flex items-center gap-1.5 px-3 py-2 rounded-md text-sm
				text-text-secondary hover:text-text-primary hover:bg-bg-hover
				disabled:opacity-50 disabled:cursor-not-allowed
				transition-colors cursor-pointer
			"
        title="削除"
      >
        <span className="icon-[mdi--trash] text-base" />
        <span className="hidden sm:inline">削除</span>
      </button>
    </div>
  );
}

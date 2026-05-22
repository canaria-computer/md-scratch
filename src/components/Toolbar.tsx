import type { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor | null;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
  className,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: string;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
				flex items-center justify-center w-8 h-8 rounded-md
				transition-colors duration-150 cursor-pointer
				${
        isActive
          ? "bg-bg-hover text-accent"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
      }
				${className ?? ""}
			`}
    >
      <span className={`${icon} text-lg`} />
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-1" />;
}

export function Toolbar({ editor, className }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div
      className={`
				flex items-center gap-0.5 px-3 py-1.5
				bg-bg-secondary border-b border-border
				${className ?? ""}
			`}
      id="toolbar"
    >
      {/* Bold */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon="icon-[mdi--format-bold]"
        title="太字 (Ctrl+B)"
      />

      {/* Italic */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon="icon-[mdi--format-italic]"
        title="斜体 (Ctrl+I)"
      />

      {/* Strikethrough */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon="icon-[mdi--format-strikethrough]"
        title="取り消し線 (Ctrl+Shift+S)"
      />

      <ToolbarDivider />

      {/* Heading 1 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        icon="icon-[mdi--format-header-1]"
        title="見出し 1"
      />

      {/* Heading 2 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        icon="icon-[mdi--format-header-2]"
        title="見出し 2"
      />

      {/* Heading 3 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        icon="icon-[mdi--format-header-3]"
        title="見出し 3"
      />

      <ToolbarDivider />

      {/* Bullet List */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon="icon-[mdi--format-list-bulleted]"
        title="箇条書き"
      />

      {/* Ordered List */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon="icon-[mdi--format-list-numbered]"
        title="番号付きリスト"
      />

      {/* Task List */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive("taskList")}
        icon="icon-[mdi--checkbox-marked-outline]"
        title="タスクリスト"
      />

      <ToolbarDivider />

      {/* Blockquote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        icon="icon-[mdi--format-quote-close]"
        title="引用"
      />

      {/* Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon="icon-[mdi--minus]"
        title="水平線"
      />

      {/* Code Block — responsive (hidden on narrow screens) */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        icon="icon-[mdi--code-braces]"
        title="コードブロック"
        className="hidden sm:flex"
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteMemo, useMemo as useMemoData } from "../hooks/useMemos";

export function DeleteConfirmPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const memo = useMemoData(id);

  const [agreed, setAgreed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(2);
  const [isDeleting, setIsDeleting] = useState(false);

  // Count down timer
  useEffect(() => {
    if (!agreed) return;

    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [agreed, secondsRemaining]);

  const handleDelete = async () => {
    if (!id || !agreed || secondsRemaining > 0) return;

    setIsDeleting(true);
    try {
      await deleteMemo(id);
      // Replace history to prevent back navigation to deleted memo
      window.history.replaceState(null, "", "/");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Waiting for data
  if (!id || memo === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted">
        <span className="icon-[mdi--loading] animate-spin text-2xl mr-2" />
        読み込み中…
      </div>
    );
  }

  // Memo not found
  if (memo === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-2">
        <span className="icon-[mdi--file-question-outline] text-4xl" />
        <p>メモが見つかりません</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 rounded-md bg-bg-hover text-text-primary hover:bg-bg-secondary transition-colors"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  // Extract first 10 lines of preview
  const doc = memo.content ? JSON.parse(memo.content) : { content: [] };
  const previewLines: string[] = [];
  let lineCount = 0;

  if (doc.content) {
    for (const node of doc.content) {
      if (lineCount >= 10) break;

      if (node.type === "paragraph" || node.type === "heading") {
        const text = node.content?.map((c: any) => c.text ?? "").join("") ?? "";
        if (text) {
          previewLines.push(text);
          lineCount++;
        }
      } else if (node.type === "codeBlock") {
        const text = node.content?.map((c: any) => c.text ?? "").join("") ?? "";
        if (text) {
          previewLines.push(`\`\`\`\n${text}\n\`\`\``);
          lineCount++;
        }
      }
    }
  }

  const isButtonEnabled = agreed && secondsRemaining === 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6 md:p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="icon-[mdi--alert-circle] text-4xl text-red-500" />
            <h1 className="text-3xl font-bold">メモを削除します</h1>
          </div>

          <p className="text-text-secondary mb-6">
            このメモを削除しようとしています。この操作は元に戻せません。
          </p>

          {/* Preview */}
          <div className="bg-bg-secondary rounded-md p-4 mb-6 border border-border">
            <h2 className="text-sm font-semibold text-text-secondary mb-3">
              プレビュー（最初の10行）
            </h2>
            <div className="text-sm text-text-muted space-y-2 max-h-48 overflow-auto">
              {previewLines.length > 0
                ? (
                  previewLines.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )
                : <div className="italic">（内容がありません）</div>}
            </div>
          </div>

          {/* Confirmation checkbox */}
          <div className="bg-bg-secondary rounded-md p-4 mb-6 border border-border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (e.target.checked) {
                    setSecondsRemaining(2);
                  }
                }}
                className="w-5 h-5"
              />
              <span className="text-sm">
                この操作は元に戻せません
              </span>
            </label>
          </div>

          {/* Timer message */}
          {agreed && secondsRemaining > 0 && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-md p-4 mb-6 text-sm text-red-400">
              削除ボタンは {secondsRemaining} 秒後に有効になります…
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={!isButtonEnabled || isDeleting}
              className="
								px-6 py-2 rounded-md font-medium
								bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
								text-white transition-colors
							"
            >
              {isDeleting ? "削除中…" : "メモを削除"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="
								px-6 py-2 rounded-md font-medium
								bg-bg-secondary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed
								text-text-primary transition-colors
							"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

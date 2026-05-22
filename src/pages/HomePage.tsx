import { useNavigate } from "react-router"
import { createMemo } from "../hooks/useMemos"

export function HomePage() {
  const navigate = useNavigate()

  const handleCreateMemo = async () => {
    const id = await createMemo()
    navigate(`/memo/${id}`)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <div className="max-w-2xl text-center">
          {/* Logo / Icon */}
          <div className="mb-8">
            <span className="icon-[mdi--note-edit-outline] text-8xl text-accent" />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            md-scratch
          </h1>

          {/* Description */}
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            シンプルで高速なマークダウンエディタ。
            <br />
            思いついたことをさっと書き留めて、整理しましょう。
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12 text-left">
            <div className="bg-bg-secondary rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="icon-[mdi--lightning-bolt] text-accent text-xl" />
                <h3 className="font-semibold text-text-primary">高速</h3>
              </div>
              <p className="text-sm text-text-secondary">
                ローカルストレージに保存、インターネット接続不要
              </p>
            </div>

            <div className="bg-bg-secondary rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="icon-[mdi--pencil] text-accent text-xl" />
                <h3 className="font-semibold text-text-primary">Markdown対応</h3>
              </div>
              <p className="text-sm text-text-secondary">
                本格的なマークダウン記法で、美しくメモを作成
              </p>
            </div>

            <div className="bg-bg-secondary rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="icon-[mdi--lock] text-accent text-xl" />
                <h3 className="font-semibold text-text-primary">プライベート</h3>
              </div>
              <p className="text-sm text-text-secondary">
                すべてのデータはブラウザに保存。サーバーに送信されません
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCreateMemo}
            className="
							px-8 py-3 rounded-lg font-semibold
							bg-accent hover:bg-accent/90
							text-bg-primary transition-colors
							flex items-center gap-2 mx-auto
						"
          >
            <span className="icon-[mdi--plus]" />
            新規メモを作成
          </button>

          {/* Footer info */}
          <div className="mt-12 text-sm text-text-muted">
            <p>Sidebar の右上の + ボタンからも新規メモを作成できます</p>
          </div>
        </div>
      </div>
    </div>
  )
}

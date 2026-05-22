import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createMemo, useMemoList } from "../hooks/useMemos";

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const memos = useMemoList();
	const navigate = useNavigate();
	const { id: activeId } = useParams();
	const [isOpen, setIsOpen] = useState(false);

	const handleCreate = async () => {
		const id = await createMemo();
		navigate(`/memo/${id}`);
		setIsOpen(false);
	};

	const handleDelete = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		navigate(`/memo/${id}/delete`);
	};

	const handleSelect = (id: string) => {
		navigate(`/memo/${id}`);
		setIsOpen(false);
	};

	const formatDate = (date: Date) => {
		const d = new Date(date);
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		const hours = String(d.getHours()).padStart(2, "0");
		const minutes = String(d.getMinutes()).padStart(2, "0");
		return `${month}/${day} ${hours}:${minutes}`;
	};

	return (
		<>
			{/* Mobile hamburger button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`
					fixed top-2 left-2 z-50 md:hidden
					flex items-center justify-center w-9 h-9 rounded-md
					bg-bg-secondary border border-border
					text-text-secondary hover:text-text-primary
					transition-colors cursor-pointer
					${className ?? ""}
				`}
				title="メニュー"
			>
				<span
					className={`text-xl ${isOpen ? "icon-[mdi--close]" : "icon-[mdi--menu]"
						}`}
				/>
			</button>

			{/* Backdrop (mobile) */}
			{isOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/50 md:hidden"
					onClick={() => setIsOpen(false)}
					onKeyDown={() => { }}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
					fixed md:relative z-40
					w-64 h-full
					bg-bg-secondary border-r border-border
					flex flex-col
					transition-transform duration-200 ease-in-out
					${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
					${className ?? ""}
				`}
				id="sidebar"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-3 py-3 border-b border-border">
					<h1 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
						<a href="/" className="flex items-center gap-1.5">
							<span className="icon-[mdi--note-edit-outline] text-accent text-lg" />
							md-scratch
						</a>
					</h1>
					<button
						type="button"
						onClick={handleCreate}
						className="
							flex items-center justify-center w-7 h-7 rounded-md
							text-text-secondary hover:text-accent hover:bg-bg-hover
							transition-colors cursor-pointer
						"
						title="新規メモ"
					>
						<span className="icon-[mdi--plus] text-lg" />
					</button>
				</div>

				{/* Memo list */}
				<nav className="flex-1 overflow-y-auto py-1">
					{memos === undefined
						? (
							<div className="px-3 py-4 text-text-muted text-sm text-center">
								読み込み中…
							</div>
						)
						: memos.length === 0
							? (
								<div className="px-3 py-4 text-text-muted text-sm text-center">
									メモがありません
								</div>
							)
							: (
								memos.map((memo) => (
									// biome-ignore lint/a11y/useSemanticElements: Nested buttons are forbidden, so a div is used here
									<div
										key={memo.id}
										onClick={() => handleSelect(memo.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												handleSelect(memo.id);
											}
										}}
										role="button"
										tabIndex={0}
										className={`
									w-full text-left px-3 py-2 mx-0
									flex items-start justify-between group
									transition-colors duration-100 cursor-pointer select-none
									${memo.id === activeId
												? "bg-bg-hover border-l-2 border-accent"
												: "hover:bg-bg-hover/50 border-l-2 border-transparent"
											}
								`}
									>
										<div className="flex-1 min-w-0">
											<div
												className={`text-sm truncate ${memo.id === activeId
													? "text-text-primary font-medium"
													: "text-text-secondary"
													}`}
											>
												{memo.title}
											</div>
											<div className="text-xs text-text-muted mt-0.5">
												{formatDate(memo.updatedAt)}
											</div>
										</div>
										<button
											type="button"
											onClick={(e) => handleDelete(e, memo.id)}
											className="
										shrink-0 ml-2 mt-0.5
																				text-danger
										transition-opacity cursor-pointer
									"
											title="削除"
										>
											<span className="icon-[mdi--delete-outline] text-base" />
										</button>
									</div>
								))
							)}
				</nav>
			</aside>
		</>
	);
}

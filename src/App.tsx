import { Route, Routes } from "react-router"
import { Sidebar } from "./components/Sidebar"
import { HomePage } from "./pages/HomePage"
import { EditorPage } from "./pages/EditorPage"
import { DeleteConfirmPage } from "./pages/DeleteConfirmPage"

function App() {
	return (
		<div className="flex h-screen bg-bg-primary text-text-primary">
			{/* Sidebar — hidden when printing */}
			<Sidebar className="print:hidden" />

			{/* Main area */}
			<main className="flex-1 flex flex-col overflow-hidden md:ml-0">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/memo/:id" element={<EditorPage />} />
					<Route path="/memo/:id/delete" element={<DeleteConfirmPage />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;

import {
	BarChart3,
	FileEdit,
	ListMusic,
	Music2,
	Settings as SettingsIcon,
	Sparkles,
} from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import AIEnhancement from "./pages/AIEnhancement";
import Analysis from "./pages/Analysis";
import Library from "./pages/Library";
import MetadataEditor from "./pages/MetadataEditor";
import Onboarding from "./pages/Onboarding";
import Playlists from "./pages/Playlists";
import Settings from "./pages/Settings";

function App() {
	const navItems = [
		{
			path: "/library",
			label: "Library",
			icon: <Music2 className="w-4 h-4" />,
		},
		{
			path: "/ai-enhancement",
			label: "AI Enhancement",
			icon: <Sparkles className="w-4 h-4" />,
		},
		{
			path: "/playlists",
			label: "Playlists",
			icon: <ListMusic className="w-4 h-4" />,
		},
		{
			path: "/metadata-editor",
			label: "Metadata Editor",
			icon: <FileEdit className="w-4 h-4" />,
		},
		{
			path: "/analysis",
			label: "Analysis",
			icon: <BarChart3 className="w-4 h-4" />,
		},
		{
			path: "/settings",
			label: "Settings",
			icon: <SettingsIcon className="w-4 h-4" />,
		},
	];

	return (
		<ThemeProvider>
			<BrowserRouter>
				<Routes>
					{/* Onboarding route */}
					<Route path="/onboarding" element={<Onboarding />} />

					{/* Dashboard routes */}
					<Route element={<DashboardLayout navItems={navItems} />}>
						<Route path="/library" element={<Library />} />
						<Route path="/ai-enhancement" element={<AIEnhancement />} />
						<Route path="/playlists" element={<Playlists />} />
						<Route path="/metadata-editor" element={<MetadataEditor />} />
						<Route path="/analysis" element={<Analysis />} />
						<Route path="/settings" element={<Settings />} />
					</Route>

					{/* Default redirect to onboarding */}
					<Route path="/" element={<Navigate to="/onboarding" replace />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

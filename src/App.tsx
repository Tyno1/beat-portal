import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
	const [greetMsg, setGreetMsg] = useState("");
	const [name, setName] = useState("");
	const [data, setData] = useState<{ item_id: number; name: string } | null>(
		null,
	);

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
		setGreetMsg(await invoke("greet", { name }));
	}

	useEffect(() => {
		if (!name) return;
		const fetchData = async () => {
			const response = await fetch("http://127.0.0.1:8000/items/1");
			const data = await response.json();
			setData(data);
			console.log(data);
		};
		fetchData();
	}, [name]);

	return (
		<ThemeProvider>
			<div className="min-h-screen bg-background text-foreground transition-colors duration-200">
				{/* Header with theme toggle */}
				<header className="bg-card border-b border-border shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<h1 className="text-xl font-semibold text-foreground">
								Beat Portal
							</h1>
							<ThemeToggle />
						</div>
					</div>
				</header>

				{/* Main content */}
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-4">
							Welcome to Beat Portal
						</h1>
						<p className="text-lg text-muted-foreground mb-8">
							Your music organization companion
						</p>

						{data && (
							<div className="card p-4 max-w-md mx-auto mb-8">
								<p className="text-sm text-muted-foreground">Fetched data:</p>
								<p className="font-mono text-primary">{data.item_id}</p>
							</div>
						)}
					</div>

					{/* Logo showcase */}
					<div className="flex justify-center space-x-8 mb-12">
						<a
							href="https://vite.dev"
							target="_blank"
							rel="noreferrer"
							className="group p-4 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
						>
							<img
								src="/vite.svg"
								className="h-12 w-12 group-hover:scale-110 transition-transform duration-200"
								alt="Vite logo"
							/>
						</a>
						<a
							href="https://tauri.app"
							target="_blank"
							rel="noreferrer"
							className="group p-4 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
						>
							<img
								src="/tauri.svg"
								className="h-12 w-12 group-hover:scale-110 transition-transform duration-200"
								alt="Tauri logo"
							/>
						</a>
						<a
							href="https://react.dev"
							target="_blank"
							rel="noreferrer"
							className="group p-4 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
						>
							<img
								src={reactLogo}
								className="h-12 w-12 group-hover:scale-110 transition-transform duration-200"
								alt="React logo"
							/>
						</a>
					</div>

					{/* Greet form */}
					<div className="card p-6 max-w-md mx-auto">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								greet();
							}}
							className="space-y-4"
						>
							<div>
								<label
									htmlFor="greet-input"
									className="block text-sm font-medium text-foreground mb-2"
								>
									Enter your name
								</label>
								<input
									id="greet-input"
									type="text"
									className="input"
									onChange={(e) => setName(e.currentTarget.value)}
									placeholder="Enter a name..."
									value={name}
								/>
							</div>
							<button type="submit" className="btn-primary w-full">
								Greet
							</button>
						</form>

						{greetMsg && (
							<div className="mt-4 p-3 bg-primary/10 rounded-lg">
								<p className="text-primary">{greetMsg}</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</ThemeProvider>
	);
}

export default App;

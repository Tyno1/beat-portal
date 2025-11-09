import { CheckCircle, Zap } from "lucide-react";
import { Badge, Button } from "../components/atoms";

export default function AIEnhancement() {
	return (
		<div className="py-4 pr-4 overflow-y-auto h-full">
			{/* Header Section */}
			<div className="flex items-center gap-4 mb-8">
				<div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
					<Zap className="w-8 h-8 text-white" />
				</div>
				<div className="flex-1">
					<h1 className="text-xl lg:text-3xl font-bold text-foreground">
						AI Metadata Enhancement
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Automatically enhance your music metadata using AI-powered analysis
						when local information is incomplete.
					</p>
				</div>
			</div>

			{/* Enhancement Options */}
			<div className="bg-card border border-border rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold text-foreground mb-4">
					Enhancement Options
				</h2>
				<div className="space-y-3">
					<label className="flex items-center gap-3 cursor-pointer">
						<input type="checkbox" defaultChecked className="w-5 h-5" />
						<span className="text-sm text-foreground">BPM Detection</span>
					</label>
					<label className="flex items-center gap-3 cursor-pointer">
						<input type="checkbox" defaultChecked className="w-5 h-5" />
						<span className="text-sm text-foreground">Key Detection</span>
					</label>
					<label className="flex items-center gap-3 cursor-pointer">
						<input type="checkbox" defaultChecked className="w-5 h-5" />
						<span className="text-sm text-foreground">
							Genre Classification
						</span>
					</label>
					<label className="flex items-center gap-3 cursor-pointer">
						<input type="checkbox" defaultChecked className="w-5 h-5" />
						<span className="text-sm text-foreground">Mood Analysis</span>
					</label>
				</div>
			</div>

			{/* Tracks Ready for Enhancement */}
			<div className="bg-card border border-border rounded-lg p-6">
				<h2 className="text-xl font-semibold text-foreground mb-4">
					Tracks Ready for Enhancement
				</h2>
				<div className="space-y-3 mb-6">
					<div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/10 transition-colors">
						<div className="flex items-center gap-3">
							<CheckCircle className="w-5 h-5 text-primary" />
							<div>
								<p className="text-sm font-medium text-foreground">
									BPM Detection
								</p>
								<p className="text-xs text-muted-foreground">DJ Mowa</p>
							</div>
						</div>
						<Badge color="warning">Missing: BPM, Key</Badge>
					</div>
					<div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/10 transition-colors">
						<div className="flex items-center gap-3">
							<CheckCircle className="w-5 h-5 text-primary" />
							<div>
								<p className="text-sm font-medium text-foreground">
									BPM Detection
								</p>
								<p className="text-xs text-muted-foreground">DJ Mowa</p>
							</div>
						</div>
						<Badge color="warning">Missing: BPM, Key</Badge>
					</div>
					<div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/10 transition-colors">
						<div className="flex items-center gap-3">
							<CheckCircle className="w-5 h-5 text-primary" />
							<div>
								<p className="text-sm font-medium text-foreground">
									BPM Detection
								</p>
								<p className="text-xs text-muted-foreground">DJ Mowa</p>
							</div>
						</div>
						<Badge color="warning">Missing: BPM, Key</Badge>
					</div>
				</div>
				<Button
					variant="solid"
					color="primary"
					size="lg"
					radius="md"
					iconBefore={<Zap />}
					className="w-full"
				>
					Enhance Selected Tracks
				</Button>
			</div>
		</div>
	);
}

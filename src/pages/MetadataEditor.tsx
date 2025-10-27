import { X } from "lucide-react";
import { Button, Input } from "../components/atoms";
import { PageHeader } from "../components/molecules";

export default function MetadataEditor() {
	return (
		<div className="p-8 overflow-y-auto h-full">
			<PageHeader title="Metadata Editor" />
			<div className="grid grid-cols-2 gap-6">
				<Input
					label="Title"
					placeholder="Enter track title"
					variant="outline"
					size="lg"
				/>
				<Input
					label="Artist"
					placeholder="Enter artist name"
					variant="outline"
					size="lg"
				/>
				<Input
					label="BPM"
					placeholder="Enter BPM"
					type="number"
					variant="outline"
					size="lg"
				/>
				<Input
					label="Key"
					placeholder="Enter musical key"
					variant="outline"
					size="lg"
				/>
				<Input
					label="Genre"
					placeholder="Enter genre"
					variant="outline"
					size="lg"
				/>
				<Input
					label="Mood"
					placeholder="Enter mood"
					variant="outline"
					size="lg"
				/>
			</div>
			<div className="flex gap-3 mt-8">
				<Button variant="solid" color="primary" size="lg" radius="md">
					Save Changes
				</Button>
				<Button
					variant="outline"
					color="secondary"
					size="lg"
					iconAfter={<X />}
					radius="md"
				>
					Cancel
				</Button>
			</div>
		</div>
	);
}

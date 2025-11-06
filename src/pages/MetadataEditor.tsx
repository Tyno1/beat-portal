import { X } from "lucide-react";
import { Button, Input } from "../components/atoms";
import { Card, CardContent, PageHeader } from "../components/molecules";

export default function MetadataEditor() {
  return (
    <Card size="lg" radius="3xl" className="mt-4 mr-4 overflow-y-auto">
      <CardContent>
          <PageHeader title="Metadata Editor" />
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Title"
              placeholder="Enter track title"
              variant="filled"
              size="lg"
            />
            <Input
              label="Artist"
              placeholder="Enter artist name"
              variant="filled"
              size="lg"
            />
            <Input
              label="BPM"
              placeholder="Enter BPM"
              type="number"
              variant="filled"
              size="lg"
            />
            <Input
              label="Key"
              placeholder="Enter musical key"
              variant="filled"
              size="lg"
            />
            <Input
              label="Genre"
              placeholder="Enter genre"
              variant="filled"
              size="lg"
            />
            <Input
              label="Mood"
              placeholder="Enter mood"
              variant="filled"
              size="lg"
            />
          </div>
          <div className="flex gap-3 mt-8">
            <Button variant="solid" color="primary" size="md" >
              Save Changes
            </Button>
            <Button
              variant="solid"
              color="secondary"
              size="md"
              iconAfter={<X size={16}/>}
            >
              Cancel
            </Button>
          </div>
      </CardContent>
    </Card>
  );
}

import { open } from "@tauri-apps/plugin-dialog";
import { platform } from "@tauri-apps/plugin-os";
import { AxiosError } from "axios";
import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { Button, Input, Select } from "../components/atoms";
import { Card, PageHeader } from "../components/molecules";
import ProgressIndicator from "../components/ui/Scan/ProgressIndicator";
import { type Theme, useTheme } from "../contexts/ThemeContext";
import { useStartScan } from "../hooks/useScan";

const THEME_OPTIONS: { label: string; value: Theme }[] = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
  { label: "System", value: "system" },
];

function isTheme(value: string): value is Theme {
  return value === "dark" || value === "light" || value === "system";
}

export default function Settings() {
  const startScanMutation = useStartScan();
  const { theme, setTheme } = useTheme();
  const [startScanError, setStartScanError] = useState<AxiosError | undefined>(
    undefined
  );
  const [musicFolderPath, setMusicFolderPath] = useState<string>("");

  const handleBrowseFolders = async () => {
    try {
      const osPlatform = platform();
      let defaultPath = "";

      // Set default path based on OS
      if (osPlatform === "macos") {
        defaultPath = "/Users";
      } else if (osPlatform === "windows") {
        defaultPath = "C:\\Users";
      } else {
        defaultPath = "/home";
      }

      const selected = await open({
        directory: true,
        multiple: true,
        title: "Select Music Folders",
        defaultPath: musicFolderPath || defaultPath,
      });

      if (selected) {
        const paths = Array.isArray(selected) ? selected : [selected];
        if (paths.length > 0) {
          setMusicFolderPath(paths[0]);

          try {
            await startScanMutation.mutateAsync(paths);
            setStartScanError(undefined);
          } catch (error) {
            console.error("Error starting scan:", error);
            setStartScanError(error as AxiosError);
          }
        }
      }
    } catch (error) {
      console.error("Error selecting folders:", error);
      if (error instanceof AxiosError) {
        setStartScanError(error);
      }
    }
  };

  const handleThemeChange = (values: string[]) => {
    const selectedValue = values[0];
    if (selectedValue && isTheme(selectedValue)) {
      setTheme(selectedValue);
    }
  };

  return (
    <div className="py-4 pr-4 overflow-y-auto h-full">
      <PageHeader title="Settings" />

      <div className="space-y-6">
        {/* Default Music Folder */}
        <Card className="p-6">
          <div>
            <label
              htmlFor="music-folder"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Default Music Folder
            </label>
            <div className="flex gap-3">
              <Input
                id="music-folder"
                placeholder="/User/Username/Music"
                variant="outline"
                containerClassName="flex-1"
                value={musicFolderPath}
                onChange={(e) => setMusicFolderPath(e.target.value)}
              />
              <Button
                variant="ghost"
                color="primary"
                iconBefore={<FolderOpen size={16} />}
                radius="md"
                size="sm"
                onClick={handleBrowseFolders}
                disabled={startScanMutation.isPending}
              >
                {startScanMutation.isPending ? "Scanning..." : "Browse"}
              </Button>
            </div>
            <ProgressIndicator error={startScanError} dismissible />
          </div>
        </Card>

        {/* AI Enhancement */}
        {/* <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            AI Enhancement
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <span className="text-sm text-foreground">
                Enable AI Enhancement
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" />
              <span className="text-sm text-foreground">
                Auto Enhance on Import
              </span>
            </label>
          </div>
        </Card> */}

        {/* <div className="h-40">

</div> */}

        {/* Appearance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Appearance
          </h2>

          <Select
            label="Theme"
            options={THEME_OPTIONS}
            value={[theme]}
            onChange={handleThemeChange}
            maxHeight="200px"
            size="md"
            variant="outline"
            placeholder="Select a theme..."
          />
        </Card>
      </div>
    </div>
  );
}

import { Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SelectOption } from "../components/atoms";
import { Button, Input, Select } from "../components/atoms";
import { Card, PageHeader } from "../components/molecules";
import {
  useAnalyzeMetadata,
  useBatchAnalyzeMetadata,
} from "../hooks/useMetadata";
import {
  useAllTracks,
  useResetTrackMetadata,
  useTrack,
  useUpdateTrack,
} from "../hooks/useTrack";
import type { PostAnalyzeMetadataRequest } from "../types/Metadata";
import type { PutTrackRequest } from "../types/Tracks";

export default function MetadataEditor() {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    bpm: "",
    key: "",
    genre: "",
    mood: "",
  });

  const { data: tracksData } = useAllTracks();
  const { data: track, isLoading: trackLoading } = useTrack(selectedTrackId);
  const resetTrackMetadata = useResetTrackMetadata();
  const updateMutation = useUpdateTrack();
  const analyzeMutation = useAnalyzeMetadata();
  const batchAnalyzeMutation = useBatchAnalyzeMetadata();

  // Flatten all pages into a single array of data only
  const tracks = useMemo(() => {
    if (!tracksData?.pages) return [];
    return tracksData.pages.flatMap((page) => page.data || []);
  }, [tracksData?.pages]);

  // Update form when track is selected
  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title || "",
        artist: track.artist || "",
        album: track.album || "",
        year: track.year?.toString() || "",
        bpm: track.bpm?.toString() || "",
        key: track.key || "",
        genre: track.genre || "",
        mood: track.mood || "",
      });
    }
  }, [track]);

  // Filter tracks for search
  const filteredTracks = tracks.filter(
    (t) =>
      !searchQuery ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trackOptions: SelectOption[] = filteredTracks.map((t) => ({
    label: `${t.artist || "Unknown"} - ${t.title || "Unknown"}`,
    value: t.id || "",
  }));

  const handleSave = async () => {
    if (!selectedTrackId) return;

    const updateData: PutTrackRequest["body"] = {};

    if (formData.title !== track?.title)
      updateData.title = formData.title || undefined;
    if (formData.artist !== track?.artist)
      updateData.artist = formData.artist || undefined;
    if (formData.album !== track?.album)
      updateData.album = formData.album || undefined;
    if (formData.year !== (track?.year?.toString() || "")) {
      updateData.year = formData.year ? parseInt(formData.year, 10) : undefined;
    }
    if (formData.bpm !== (track?.bpm?.toString() || "")) {
      updateData.bpm = formData.bpm ? parseInt(formData.bpm, 10) : undefined;
    }
    if (formData.key !== track?.key) updateData.key = formData.key || undefined;
    if (formData.genre !== track?.genre)
      updateData.genre = formData.genre || undefined;
    if (formData.mood !== track?.mood)
      updateData.mood = formData.mood || undefined;

    if (Object.keys(updateData).length === 0) {
      alert("No changes to save");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        trackId: selectedTrackId,
        request: updateData,
      });
      alert("Track updated successfully");
    } catch (error) {
      console.error("Error updating track:", error);
      alert("Failed to update track");
    }
  };

  const handleReset = async () => {
    if (!selectedTrackId) return;
    await resetTrackMetadata.mutateAsync({
      trackId: selectedTrackId,
      request: { update_track: true },
    });
    alert("Track metadata reset successfully");
  };

  const handleAnalyze = async () => {
    if (!selectedTrackId || !track?.file_path) {
      alert("Please select a track with a file path");
      return;
    }

    const request: PostAnalyzeMetadataRequest = {
      file_path: track.file_path,
      analysis_options: {
        use_audio_analysis: true,
      },
    };

    try {
      const result = await analyzeMutation.mutateAsync(request);
      alert(
        `Analysis complete!\nBPM: ${
          result.detected_metadata?.bpm || "N/A"
        }\nKey: ${result.detected_metadata?.key || "N/A"}`
      );
      // Refresh track data
      if (selectedTrackId) {
        setSelectedTrackId(null);
        setTimeout(() => setSelectedTrackId(selectedTrackId), 100);
      }
    } catch (error) {
      console.error("Error analyzing track:", error);
      alert("Failed to analyze track");
    }
  };

  const handleBatchAnalyze = async () => {
    if (tracks.length === 0) {
      alert("No tracks available for batch analysis");
      return;
    }

    const trackIds = tracks
      .filter((t) => t.id && t.file_path)
      .map((t) => t.id!)
      .slice(0, 100); // Limit to 100 tracks

    if (trackIds.length === 0) {
      alert("No tracks with file paths available");
      return;
    }

    if (
      !confirm(
        `This will analyze ${trackIds.length} tracks. This may take a while. Continue?`
      )
    ) {
      return;
    }

    try {
      const result = await batchAnalyzeMutation.mutateAsync({
        track_ids: trackIds,
      });
      alert(
        `Batch analysis started!\nJob ID: ${result.job_id}\nStatus: ${result.status}`
      );
    } catch (error) {
      console.error("Error starting batch analysis:", error);
      alert("Failed to start batch analysis");
    }
  };

  return (
    <div className="py-4 pr-4 overflow-y-auto h-full">
      <PageHeader title="Metadata Editor" />

      <div className="space-y-6">
        {/* Track Selection */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  label="Search Tracks"
                  placeholder="Search by title or artist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outline"
                  size="md"
                  leftIcon={<Search size={16} />}
                />
              </div>
              <Button
                variant="outline"
                color="secondary"
                size="md"
                iconBefore={<Sparkles size={16} />}
                onClick={handleBatchAnalyze}
                disabled={batchAnalyzeMutation.isPending}
              >
                {batchAnalyzeMutation.isPending
                  ? "Analyzing..."
                  : "Batch Analyze All"}
              </Button>
            </div>
            <Select
              label="Select Track"
              options={trackOptions}
              value={selectedTrackId ? [selectedTrackId] : []}
              onChange={(values) => setSelectedTrackId(values[0] || null)}
              variant="outline"
              size="md"
              placeholder="Select a track to edit..."
              maxHeight="200px"
            />
          </div>
        </Card>

        {/* Metadata Form */}
        {selectedTrackId && (
          <Card size="lg" radius="3xl" className="overflow-y-auto">
            {trackLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading track...</p>
              </div>
            ) : track ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Title"
                    placeholder="Enter track title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="Artist"
                    placeholder="Enter artist name"
                    value={formData.artist}
                    onChange={(e) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="Album"
                    placeholder="Enter album name"
                    value={formData.album}
                    onChange={(e) =>
                      setFormData({ ...formData, album: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="Year"
                    placeholder="Enter year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="BPM"
                    placeholder="Enter BPM"
                    type="number"
                    value={formData.bpm}
                    onChange={(e) =>
                      setFormData({ ...formData, bpm: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="Key"
                    placeholder="Enter musical key (e.g., Am, C)"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData({ ...formData, key: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="Genre"
                    placeholder="Enter genre"
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                  <Input
                    label="Mood"
                    placeholder="Enter mood"
                    value={formData.mood}
                    onChange={(e) =>
                      setFormData({ ...formData, mood: e.target.value })
                    }
                    variant="filled"
                    size="lg"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    variant="solid"
                    color="primary"
                    size="md"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    color="primary"
                    size="md"
                    iconBefore={<Sparkles size={16} />}
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending || !track.file_path}
                  >
                    {analyzeMutation.isPending
                      ? "Analyzing..."
                      : "Analyze Metadata"}
                  </Button>
                  <Button
                    variant="ghost"
                    color="primary"
                    size="md"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="ghost"
                    color="primary"
                    size="md"
                    iconAfter={<X size={16} />}
                    onClick={() => {
                      setSelectedTrackId(null);
                      setSearchQuery("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Track not found</p>
              </div>
            )}
          </Card>
        )}

        {!selectedTrackId && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              Select a track from the list above to edit its metadata
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

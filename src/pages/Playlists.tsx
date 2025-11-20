import { Edit2, Music, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../components/atoms";
import { Card, Modal, PageHeader } from "../components/molecules";
import PlaylistDetail from "../components/ui/Playlists/PlaylistDetail";
import {
	useCreatePlaylist,
	useDeletePlaylist,
	usePlaylists,
	useUpdatePlaylist,
} from "../hooks/usePlaylists";
import type { PostPlaylistRequest, PutPlaylistRequest } from "../types/Playlists";

export default function Playlists() {
	const { data: playlistsData, isLoading } = usePlaylists();
	const createMutation = useCreatePlaylist();
	const updateMutation = useUpdatePlaylist();
	const deleteMutation = useDeletePlaylist();

	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [detailModalOpen, setDetailModalOpen] = useState(false);
	const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
	const [playlistName, setPlaylistName] = useState("");
	const [playlistDescription, setPlaylistDescription] = useState("");

	const playlists = playlistsData || [];

	const handleCreate = () => {
		setPlaylistName("");
		setPlaylistDescription("");
		setSelectedPlaylist(null);
		setCreateModalOpen(true);
	};

	const handleEdit = (playlistId: string, name: string, description?: string) => {
		setSelectedPlaylist(playlistId);
		setPlaylistName(name);
		setPlaylistDescription(description || "");
		setEditModalOpen(true);
	};

	const handleDelete = (playlistId: string) => {
		setSelectedPlaylist(playlistId);
		setDeleteModalOpen(true);
	};

	const handleCreateSubmit = async () => {
		if (!playlistName.trim()) return;

		const request: PostPlaylistRequest = {
			name: playlistName.trim(),
			description: playlistDescription.trim() || undefined,
		};

		try {
			await createMutation.mutateAsync(request);
			setCreateModalOpen(false);
			setPlaylistName("");
			setPlaylistDescription("");
		} catch (error) {
			console.error("Error creating playlist:", error);
		}
	};

	const handleUpdateSubmit = async () => {
		if (!selectedPlaylist || !playlistName.trim()) return;

		const request: PutPlaylistRequest["body"] = {
			name: playlistName.trim(),
			description: playlistDescription.trim() || undefined,
		};

		try {
			await updateMutation.mutateAsync({
				playlistId: selectedPlaylist,
				request,
			});
			setEditModalOpen(false);
			setSelectedPlaylist(null);
			setPlaylistName("");
			setPlaylistDescription("");
		} catch (error) {
			console.error("Error updating playlist:", error);
		}
	};

	const handleDeleteConfirm = async () => {
		if (!selectedPlaylist) return;

		try {
			await deleteMutation.mutateAsync(selectedPlaylist);
			setDeleteModalOpen(false);
			setSelectedPlaylist(null);
		} catch (error) {
			console.error("Error deleting playlist:", error);
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "Unknown";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString();
		} catch {
			return dateString;
		}
	};

	return (
		<div className="py-4 pr-4 overflow-y-auto h-full">
			<div className="flex items-center justify-between mb-6">
				<PageHeader title="Playlists" />
				<Button
					variant="solid"
					color="primary"
					size="md"
					iconBefore={<Plus size={16} />}
					onClick={handleCreate}
				>
					Create Playlist
				</Button>
			</div>

			{isLoading ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">Loading playlists...</p>
				</div>
			) : playlists.length === 0 ? (
				<div className="text-center py-12">
					<Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<p className="text-lg font-semibold text-foreground mb-2">
						No playlists yet
					</p>
					<p className="text-sm text-muted-foreground mb-4">
						Create your first playlist to get started
					</p>
					<Button
						variant="solid"
						color="primary"
						size="md"
						iconBefore={<Plus size={16} />}
						onClick={handleCreate}
					>
						Create Playlist
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					{playlists.map((playlist) => (
						<Card
							key={playlist.id}
							className="cursor-pointer hover:shadow-lg transition-shadow relative group"
							onClick={() => {
								setSelectedPlaylist(playlist.id || null);
								setDetailModalOpen(true);
							}}
						>
							<div className="w-full h-48 bg-primary rounded-lg flex items-center justify-center mb-4">
								<Music className="w-12 h-12 text-white" />
							</div>
							<h3 className="text-medium font-semibold text-foreground mb-1 truncate">
								{playlist.name}
							</h3>
							<p className="text-sm text-muted-foreground mb-2">
								{formatDate(playlist.created_at)}
							</p>
							{playlist.description && (
								<p className="text-xs text-muted-foreground line-clamp-2 mb-2">
									{playlist.description}
								</p>
							)}
							<div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button
									variant="ghost"
									size="sm"
									iconBefore={<Edit2 size={14} />}
									onClick={(e) => {
										e.stopPropagation();
										handleEdit(playlist.id || "", playlist.name || "", playlist.description);
									}}
								>
									Edit
								</Button>
								<Button
									variant="ghost"
									size="sm"
									color="danger"
									iconBefore={<Trash2 size={14} />}
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(playlist.id || "");
									}}
								>
									Delete
								</Button>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Create Playlist Modal */}
			<Modal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				title="Create Playlist"
				size="md"
			>
				<div className="space-y-4">
					<Input
						label="Playlist Name"
						placeholder="Enter playlist name"
						value={playlistName}
						onChange={(e) => setPlaylistName(e.target.value)}
						variant="outline"
						size="md"
					/>
					<Input
						label="Description (Optional)"
						placeholder="Enter playlist description"
						value={playlistDescription}
						onChange={(e) => setPlaylistDescription(e.target.value)}
						variant="outline"
						size="md"
					/>
					<div className="flex gap-3 justify-end pt-4">
						<Button
							variant="outline"
							color="secondary"
							size="md"
							onClick={() => setCreateModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="primary"
							size="md"
							onClick={handleCreateSubmit}
							disabled={!playlistName.trim() || createMutation.isPending}
						>
							{createMutation.isPending ? "Creating..." : "Create"}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Edit Playlist Modal */}
			<Modal
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				title="Edit Playlist"
				size="md"
			>
				<div className="space-y-4">
					<Input
						label="Playlist Name"
						placeholder="Enter playlist name"
						value={playlistName}
						onChange={(e) => setPlaylistName(e.target.value)}
						variant="outline"
						size="md"
					/>
					<Input
						label="Description (Optional)"
						placeholder="Enter playlist description"
						value={playlistDescription}
						onChange={(e) => setPlaylistDescription(e.target.value)}
						variant="outline"
						size="md"
					/>
					<div className="flex gap-3 justify-end pt-4">
						<Button
							variant="outline"
							color="secondary"
							size="md"
							onClick={() => setEditModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="primary"
							size="md"
							onClick={handleUpdateSubmit}
							disabled={!playlistName.trim() || updateMutation.isPending}
						>
							{updateMutation.isPending ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Delete Playlist"
				size="sm"
			>
				<div className="space-y-4">
					<p className="text-sm text-foreground">
						Are you sure you want to delete this playlist? This action cannot be undone.
					</p>
					<div className="flex gap-3 justify-end pt-4">
						<Button
							variant="outline"
							color="secondary"
							size="md"
							onClick={() => setDeleteModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="solid"
							color="danger"
							size="md"
							onClick={handleDeleteConfirm}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</div>
			</Modal>

			{/* Playlist Detail Modal */}
			{detailModalOpen && selectedPlaylist && (
				<PlaylistDetail
					playlistId={selectedPlaylist}
					onClose={() => {
						setDetailModalOpen(false);
						setSelectedPlaylist(null);
					}}
				/>
			)}
		</div>
	);
}

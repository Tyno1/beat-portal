import FilterChips from "../components/ui/Library/components/FilterChips";
import LibraryHeader from "../components/ui/Library/components/LibraryHeader";
import LibraryToolbar from "../components/ui/Library/components/LibraryToolbar";
import TrackTable from "../components/ui/Library/components/TrackTable";

interface Track {
  id: number;
  trackName: string;
  artist: string;
  year: number;
  bpm: number;
  key: string;
  genre: string;
  mood: string;
}

const mockTracks: Track[] = [
  { id: 377, trackName: "Hold me down", artist: "Paul Smith", year: 2001, bpm: 377, key: "A", genre: "Blues", mood: "Happy" },
  { id: 453, trackName: "Sekkle", artist: "Gieger", year: 2001, bpm: 332, key: "F", genre: "Dancehall", mood: "Dark" },
  { id: 332, trackName: "Play", artist: "Bonny Bieber", year: 2001, bpm: 938, key: "C", genre: "Afro beats", mood: "Chill" },
  { id: 938, trackName: "Meet me half way", artist: "Cynthia Wood", year: 1994, bpm: 335, key: "F", genre: "Amapiano", mood: "Sad" },
  { id: 335, trackName: "Kilo", artist: "Hard Filly", year: 2020, bpm: 430, key: "F", genre: "Hiphop", mood: "Sad" },
  { id: 430, trackName: "Me and you", artist: "Drake Pint", year: 2023, bpm: 839, key: "C", genre: "Rap", mood: "Happy" },
  { id: 839, trackName: "Philo", artist: "Benny Guiness", year: 2010, bpm: 390, key: "C", genre: "Trap", mood: "Happy" },
  { id: 390, trackName: "Bend low", artist: "Acon Mills", year: 1999, bpm: 390, key: "A", genre: "Trap", mood: "Happy" },
  { id: 390, trackName: "Island men", artist: "Wensty", year: 1994, bpm: 430, key: "A", genre: "Blues", mood: "Dark" },
  { id: 430, trackName: "Ocean dance", artist: "Bulker", year: 2000, bpm: 839, key: "B", genre: "Blues", mood: "Sad" },
  { id: 839, trackName: "Kill me", artist: "Wander Tury", year: 2025, bpm: 390, key: "C", genre: "Trap", mood: "Chill" },
  { id: 390, trackName: "My heart bleeds", artist: "Hale Keith", year: 2020, bpm: 390, key: "F", genre: "Dancehall", mood: "Chill" },
  { id: 390, trackName: "Money", artist: "Hail Maih", year: 1980, bpm: 390, key: "A", genre: "Amapiano", mood: "Chill" },
  { id: 390, trackName: "Sad Men", artist: "Buddy Nod", year: 2021, bpm: 390, key: "A", genre: "Dancehall", mood: "Sad" },
  { id: 390, trackName: "Opps Home", artist: "Killer Maddison", year: 2013, bpm: 390, key: "A", genre: "Dancehall", mood: "Dark" },
];

const filterChips = [
  { label: "All Tracks", active: true },
  { label: "120 - 128 Bpm", active: false },
  { label: "Sad", active: false },
  { label: "Blues", active: false },
  { label: "Recently Added", active: false },
];

export default function Library() {
  return (
    <div className="p-4 overflow-y-auto h-full">
      <LibraryHeader />
      <LibraryToolbar />
      <div className="my-8">
        <FilterChips chips={filterChips} />
      </div>
      <TrackTable data={mockTracks} />
    </div>
  );
}

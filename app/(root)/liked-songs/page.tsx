"use client";

import ContinuousPlayer from "@/components/custom/ContinuousPlayer";
import CustomInput from "@/components/custom/CustomInput";
import SongCard from "@/components/custom/SongCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import { Squares } from "@/components/ui/squares-background";
import { getAllSongs } from "@/lib/actions/song.actions";
import { Artist, Song, SongArtistMap } from "@prisma/client";
import { HeartIcon, MusicIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LikedSongsPage = () => {
  const [songs, setSongs] = useState<(Song & { isLiked: boolean; artists: (SongArtistMap & { artist: Artist })[] })[]>(
    []
  );
  const router = useRouter();
  const [currentSongId, setCurrentSongId] = useState<number>();
  const [search, setSearch] = useState("");

  const fetchAllSongs = async () => {
    try {
      const res = await getAllSongs({ search });
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      // console.log({ d: res.data });
      setSongs(res.data.filter((s: any) => s.isLiked));
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchAllSongs();
  }, [search]);

  if (currentSongId) {
    return <ContinuousPlayer currentSongId={currentSongId} songs={songs} setCurrentSongId={setCurrentSongId} />;
  }

  return (
    <div>
      <Squares
        className="absolute h-full opacity-10 pointer-events-none"
        direction="diagonal"
        speed={0.2}
        squareSize={40}
        hoverFillColor="#0d1f2b"
        borderColor="#4d7a7a"
      />
      <div className="flex justify-center h-full pt-10 md:pt-40 pb-10">
        <div className="w-full max-w-5xl flex flex-col gap-5 px-5">
          <div className="flex flex-col items-center mb-5">
            <HeartIcon className="h-16 w-16" />
          </div>
          <CustomInput
            icon={SearchIcon}
            placeholder="Find Liked Songs..."
            position="start"
            className="h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-fit overflow-hidden overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-1 z-[5]">
            {songs.length === 0 && (
              <p className="text-center text-secondary col-span-full text-xs mt-5">No Liked Songs Available.</p>
            )}
            {songs.map((s) => (
              <SongCard song={s} key={s.songId} action={() => setCurrentSongId(s.songId)} onLiked={fetchAllSongs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedSongsPage;

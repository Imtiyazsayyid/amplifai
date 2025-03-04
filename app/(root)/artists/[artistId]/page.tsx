"use client";

import ContinuousPlayer from "@/components/custom/ContinuousPlayer";
import CustomInput from "@/components/custom/CustomInput";
import SongCard from "@/components/custom/SongCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import AudioPlayer from "@/components/ui/audio-player";
import { Squares } from "@/components/ui/squares-background";
import { getAllSongs } from "@/lib/actions/song.actions";
import { getIntOrUndefined } from "@/lib/commonHelpers";
import { ALT_IMG_URL } from "@/lib/constants";
import { Artist, Song, SongArtistMap } from "@prisma/client";
import { ArrowLeftCircleIcon, Icon, MicVocalIcon, MusicIcon, PlayCircleIcon, PlayIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

interface Props {
  params: Promise<{ artistId: string }>;
}

const MusicPage = ({ params }: Props) => {
  const { artistId } = use(params);
  const currentAtistId = getIntOrUndefined(artistId);

  const router = useRouter();
  // if (currentAtistId) {
  //   router.push("/");
  // }

  const [songs, setSongs] = useState<(Song & { isLiked: boolean; artists: (SongArtistMap & { artist: Artist })[] })[]>(
    []
  );

  const [currentSongId, setCurrentSongId] = useState<number>();
  const [search, setSearch] = useState("");

  const fetchAllSongs = async () => {
    try {
      const res = await getAllSongs({ search, artistId: currentAtistId });
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      setSongs(res.data);
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
          <div className="flex flex-row justify-center mb-5 gap-2">
            {/* <MusicIcon className="h-16 w-16" /> */}
            <MicVocalIcon className="h-16 w-16" />
          </div>
          <CustomInput
            icon={SearchIcon}
            placeholder="Find Songs..."
            position="start"
            className="h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-fit overflow-hidden overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-1 z-10">
            {songs.map((s) => (
              <SongCard song={s} key={s.songId} action={() => setCurrentSongId(s.songId)} onLiked={fetchAllSongs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;

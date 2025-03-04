"use client";

import ArtistCard from "@/components/custom/ArtistCard";
import ContinuousPlayer from "@/components/custom/ContinuousPlayer";
import CustomInput from "@/components/custom/CustomInput";
import SongCard from "@/components/custom/SongCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import AudioPlayer from "@/components/ui/audio-player";
import { Squares } from "@/components/ui/squares-background";
import { getAllArtists } from "@/lib/actions/artist.actions";
import { getAllSongs } from "@/lib/actions/song.actions";
import { ALT_IMG_URL } from "@/lib/constants";
import { Artist, Song, SongArtistMap } from "@prisma/client";
import { ArrowLeftCircleIcon, Icon, MicVocalIcon, MusicIcon, PlayCircleIcon, PlayIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MusicPage = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const fetchAllSongs = async () => {
    try {
      const res = await getAllArtists({ search });
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      // console.log({ d: res.data });
      setArtists(res.data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchAllSongs();
  }, [search]);

  // if (currentSongId) {
  //   return <ContinuousPlayer currentSongId={currentSongId} songs={songs} setCurrentSongId={setCurrentSongId} />;
  // }

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
            <MicVocalIcon className="h-16 w-16" />
          </div>
          <CustomInput
            icon={SearchIcon}
            placeholder="Find Artists..."
            position="start"
            className="h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-fit overflow-hidden overflow-y-auto grid grid-cols-2 md:grid-cols-5 gap-1 z-10">
            {artists.map((a) => (
              <ArtistCard artist={a} key={a.artistId} />
            ))}

            {/* {songs.map((s) => (
            <SongCard song={s} key={s.songId} action={() => setCurrentSongId(s.songId)} onLiked={fetchAllSongs} />
          ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;

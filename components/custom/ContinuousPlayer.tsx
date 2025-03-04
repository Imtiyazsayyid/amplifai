import { Artist, Song, SongArtistMap } from "@prisma/client";
import React, { useState } from "react";
import AudioPlayer from "../ui/audio-player";
import { ALT_IMG_URL } from "@/lib/constants";
import { ArrowLeftCircleIcon } from "lucide-react";

interface Props {
  setCurrentSongId: (currentSongId: number | undefined) => void;
  currentSongId: number;
  songs: (Song & { isLiked: boolean; artists: (SongArtistMap & { artist: Artist })[] })[];
}

const ContinuousPlayer = ({ songs, currentSongId, setCurrentSongId }: Props) => {
  const [currentSong, setCurrentSong] = useState<
    (Song & { isLiked: boolean; artists: (SongArtistMap & { artist: Artist })[] }) | undefined
  >(songs.find((s) => s.songId === currentSongId));

  function nextSong() {
    if (currentSong) {
      const currentIndex = songs.findIndex((s) => s.songId === currentSong.songId);
      const nextIndex = (currentIndex + 1) % songs.length;
      setCurrentSong(songs[nextIndex]);
    }
  }

  function previousSong() {
    if (currentSong) {
      const currentIndex = songs.findIndex((s) => s.songId === currentSong.songId);
      const prevIndex = (currentIndex - 1) % songs.length;
      setCurrentSong(songs[prevIndex]);
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-full w-full gap-2">
      {/* Background Image with Blur & Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-lg opacity-20"
        style={{
          backgroundImage: `url(${currentSong?.imgUrl})`,
        }}
      ></div>

      {/* Foreground Content */}

      {currentSong && (
        <div className="relative p-2 bg-secondary rounded-[1.8rem]">
          <AudioPlayer
            // setIsPlaying={setIsPlaying}
            // isPlaying={isPlaying}
            nextSongAction={nextSong}
            prevSongAction={previousSong}
            src={`/songs/${currentSong.url}`}
            cover={currentSong.imgUrl || ALT_IMG_URL}
            title={currentSong.name.toUpperCase()}
            subtitle={currentSong.artists.map((a) => a.artist.name).join(", ")}
          />
        </div>
      )}

      <div
        className="flex gap-1 items-center text-gray-500 hover:text-white transition-all duration-200 cursor-pointer z-20"
        onClick={() => {
          setCurrentSong(undefined);
          setCurrentSongId(undefined);
        }}
      >
        <ArrowLeftCircleIcon className="h-4 w-4" />
        <p className="font-bold">Back</p>
      </div>
    </div>
  );
};

export default ContinuousPlayer;

"use client";

import { likeOrUnlikeSong } from "@/lib/actions/song.actions";
import { ALT_IMG_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Artist, Song, SongArtistMap } from "@prisma/client";
import { HeartIcon, PlayCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import StandardErrorToast from "./StandardErrorToast";

interface Props {
  song: Song & { isLiked: boolean; artists: (SongArtistMap & { artist: Artist })[] };
  action: () => void;
  onLiked: () => void;
}

const SongCard = ({ song, action, onLiked }: Props) => {
  const [isLiked, setLiked] = useState(song.isLiked);

  const handleLikeOrUnlikeSong = async () => {
    try {
      setLiked(!isLiked);

      const res = await likeOrUnlikeSong(song.songId);
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      // setLiked(!isLiked);
      onLiked();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div
      className="w-full min-h-20 h-20 bg-primary rounded-xl p-2 flex gap-3 cursor-pointer pr-4"
      key={song.songId}
      onClick={action}
    >
      <div className="relative">
        <img
          height={400}
          width={400}
          src={song.imgUrl || ALT_IMG_URL}
          className="w-20 h-full rounded-lg object-cover"
        />
        <PlayCircleIcon className="absolute inset-0 m-auto w-8 h-8 text-white opacity-20 hover:opacity-80 transition-all duration-300 cursor-pointer" />
      </div>
      <div className="flex flex-col justify-center w-full">
        <h1 className="font-bold">{song.name}</h1>
        <p className="text-xs text-secondary">{song.artists.map((a) => a.artist.name).join(", ")}</p>
      </div>
      <div className="flex items-center pr-2">
        <HeartIcon
          className={cn("h-4 w-4", isLiked && "fill-rose-900 stroke-rose-900")}
          onClick={(e) => {
            e.stopPropagation();
            handleLikeOrUnlikeSong();
          }}
        />
      </div>
    </div>
  );
};

export default SongCard;

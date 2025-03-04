"use client";

import { ALT_PROFILE_URL } from "@/lib/constants";
import { Artist } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  artist: Artist;
}

const ArtistCard = ({ artist }: Props) => {
  const router = useRouter();

  return (
    <div
      className="bg-primary/50 rounded-xl flex flex-col items-center justify-center p-5 gap-2 hover:bg-primary/80 transition-all duration-200 cursor-pointer"
      onClick={() => router.push("/artists/" + artist.artistId)}
    >
      <div className="h-20 w-20 rounded-full bg-primary">
        <img src={artist.imgUrl || ALT_PROFILE_URL} className="h-full w-full object-cover rounded-full" />
      </div>
      <p className="font-bold text-center">{artist.name}</p>
    </div>
  );
};

export default ArtistCard;

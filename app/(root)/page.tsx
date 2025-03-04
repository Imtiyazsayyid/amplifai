"use client";

import ArtistCard from "@/components/custom/ArtistCard";
import ContinuousPlayer from "@/components/custom/ContinuousPlayer";
import SongCard from "@/components/custom/SongCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import { Squares } from "@/components/ui/squares-background";
import { getAllArtists } from "@/lib/actions/artist.actions";
import { getAllSongs } from "@/lib/actions/song.actions";
import { useUser } from "@clerk/nextjs";
import { Artist, Song, SongArtistMap } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { set } from "zod";

const HomePage = () => {
  const [songs, setSongs] = useState<(Song & { isLiked: boolean; artists: (SongArtistMap & { artist: Artist })[] })[]>(
    []
  );
  const [currentSongId, setCurrentSongId] = useState<number>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const router = useRouter();
  const [likeChanged, setLikeChanged] = useState(false);

  const fetchAllSongs = async () => {
    try {
      const res = await getAllSongs();
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      console.log({ res: res.data });

      setSongs(res.data);
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchAllArtists = async () => {
    try {
      const res = await getAllArtists();
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      setArtists(res.data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchAllSongs();
    fetchAllArtists();
  }, [likeChanged]);

  const { user, isLoaded } = useUser();
  if (!isLoaded) return;

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
      <div className="flex justify-center h-full pt-10 md:pt-28 pb-40">
        <div className="w-full max-w-5xl flex flex-col gap-5 px-5 items-center">
          {/* <h1 className="text-4xl font-bold w-full text-left">
            <span className="text-secondary">Welcome,</span> {user?.firstName} 👋
          </h1> */}

          <h1 className="text-4xl font-bold text-center md:text-left text-special w-fit">Latest Releases</h1>
          <div className="w-full h-fit max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-2">
            {songs.map((s) => (
              <SongCard song={s} key={s.songId} action={() => setCurrentSongId(s.songId)} onLiked={fetchAllSongs} />
            ))}
          </div>

          <h1 className="text-4xl font-bold text-center md:text-left text-special w-fit mt-16">Top Artists</h1>
          <div className="w-full h-fit max-h-96 overflow-y-auto grid grid-cols-2 md:grid-cols-5 gap-2">
            {artists.slice(0, 10).map((a) => (
              <ArtistCard artist={a} key={a.artistId} />
            ))}
          </div>

          <h1 className="text-4xl font-bold text-center md:text-left text-special w-fit mt-16">You Love These</h1>
          <div className="w-full h-fit max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-2">
            {songs
              .filter((s) => s.isLiked)
              .slice(0, 6)
              .map((s) => (
                <SongCard
                  hideLike
                  song={s}
                  key={s.songId}
                  action={() => setCurrentSongId(s.songId)}
                  onLiked={() => {
                    setLikeChanged(!setLikeChanged);
                    fetchAllSongs();
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

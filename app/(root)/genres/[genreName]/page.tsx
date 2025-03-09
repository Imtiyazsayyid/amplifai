"use client";

import React, { useEffect, useState } from "react";
import { Squares } from "@/components/ui/squares-background";
import SongCard from "@/components/custom/SongCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import { getSongsByGenre } from "@/lib/actions/genre.actions";
import { useParams } from "next/navigation";
import { Artist, Genre, Song, SongArtistMap } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ContinuousPlayer from "@/components/custom/ContinuousPlayer";

// Define the song type to match what SongCard expects
type SongWithDetails = Song & {
  isLiked: boolean;
  artists: (SongArtistMap & { artist: Artist })[];
};

const GenreDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const genreName = params.genreName as string;

  const [songs, setSongs] = useState<SongWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSongId, setCurrentSongId] = useState<number | undefined>(undefined);

  // Format the genre name for display (e.g., "HIPHOP" -> "Hip Hop")
  const formatGenreName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const fetchSongsByGenre = async () => {
    try {
      setIsLoading(true);
      const res = await getSongsByGenre(genreName);

      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Failed to load songs");
        return;
      }

      setSongs(res.data);
    } catch (error) {
      console.log({ error });
      StandardErrorToast("An error occurred while loading songs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (genreName) {
      fetchSongsByGenre();
    }
  }, [genreName]);

  const handleSongAction = (songId: number) => {
    setCurrentSongId(songId);
  };

  const handleSongLiked = () => {
    // Refresh the songs to update like status
    fetchSongsByGenre();
  };

  // If a song is selected, show the continuous player
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
      <div className="flex justify-center h-full pt-10 md:pt-40 pb-40">
        <div className="w-full max-w-5xl flex flex-col gap-5 px-5 items-center">
          <div className="w-full flex items-center justify-center relative">
            <Button variant="ghost" className="absolute left-0" onClick={() => router.push("/genres")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-4xl md:text-6xl text-special font-bold text-center">{formatGenreName(genreName)}</h1>
          </div>

          <p className="text-center text-muted-foreground mt-2 mb-8">Explore {formatGenreName(genreName)} songs</p>

          {isLoading ? (
            <div className="w-full text-center mt-10">
              <p className="text-muted-foreground">Loading songs...</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="w-full text-center mt-10">
              <p className="text-muted-foreground">No songs found for this genre</p>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 gap-4">
              {songs.map((song) => (
                <SongCard
                  key={song.songId}
                  song={song}
                  action={() => handleSongAction(song.songId)}
                  onLiked={handleSongLiked}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreDetailPage;

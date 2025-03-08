"use client";

import ArtistCard from "@/components/custom/ArtistCard";
import PlaylistCard from "@/components/custom/PlaylistCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import StandardSuccessToast from "@/components/custom/StandardSuccessToast";
import { Button } from "@/components/ui/button";
import { Squares } from "@/components/ui/squares-background";
import { generatePlaylistForUser, getAllPlaylists } from "@/lib/actions/playlist.actions";
import { Playlist } from "@prisma/client";
import { SparklesIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllPlaylists = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPlaylists();
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      setPlaylists(res.data);
    } catch (error) {
      console.log({ error });
      StandardErrorToast("Failed to load playlists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlaylist = async () => {
    try {
      setIsGenerating(true);
      const res = await generatePlaylistForUser();
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      StandardSuccessToast("Playlist generated successfully!");
      fetchAllPlaylists();
    } catch (error) {
      console.log({ error });
      StandardErrorToast("Failed to generate playlist");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchAllPlaylists();
  }, []);

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
          <h1 className="text-5xl md:text-7xl text-special font-bold">Magic Playlists</h1>
          <div className="w-full flex justify-center mt-5">
            <Button onClick={handleGeneratePlaylist} disabled={isGenerating} className="flex items-center gap-2">
              {isGenerating ? "Generating..." : "Generate Playlist"} <SparklesIcon className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="w-full text-center mt-10">
              <p className="text-muted-foreground">Loading playlists...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="w-full text-center mt-10">
              <p className="text-muted-foreground">No playlists yet. Generate one to get started!</p>
            </div>
          ) : (
            <div className="w-full h-fit rounded-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
              {playlists.map((p) => (
                <PlaylistCard playlist={p} key={p.playlistId} onDelete={fetchAllPlaylists} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistsPage;

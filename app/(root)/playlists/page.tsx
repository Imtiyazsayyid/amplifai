"use client";

import ArtistCard from "@/components/custom/ArtistCard";
import PlaylistCard from "@/components/custom/PlaylistCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import { Button } from "@/components/ui/button";
import { Squares } from "@/components/ui/squares-background";
import { generatePlaylistForUser, getAllPlaylists } from "@/lib/actions/playlist.actions";
import { Playlist } from "@prisma/client";
import { SparklesIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const fetchAllPlaylists = async () => {
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
    }
  };

  const handleGeneratePlaylist = async () => {
    try {
      const res = await generatePlaylistForUser();
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong");
        return;
      }

      fetchAllPlaylists();
    } catch (error) {
      console.log({ error });
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
            <Button onClick={handleGeneratePlaylist}>
              Generate Playlist <SparklesIcon />
            </Button>
          </div>
          <div className="w-full h-fit rounded-xl grid grid-cols-3 md:grid-cols-5 gap-2">
            {playlists.map((p) => (
              <PlaylistCard playlist={p} key={p.playlistId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistsPage;

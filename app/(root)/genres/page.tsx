"use client";

import React, { useEffect, useState } from "react";
import { Squares } from "@/components/ui/squares-background";
import GenreCard from "@/components/custom/GenreCard";
import StandardErrorToast from "@/components/custom/StandardErrorToast";
import { getAllGenres } from "@/lib/actions/genre.actions";

interface Genre {
  name: string;
  displayName: string;
  color: string;
  icon: string;
}

const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGenres = async () => {
    try {
      setIsLoading(true);
      const res = await getAllGenres();

      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Failed to load genres");
        return;
      }

      setGenres(res.data);
    } catch (error) {
      console.log({ error });
      StandardErrorToast("An error occurred while loading genres");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
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
          <h1 className="text-5xl md:text-7xl text-special font-bold">Music Genres</h1>
          <p className="text-center text-muted-foreground mt-2 mb-8">Explore music by genre and discover new songs</p>

          {isLoading ? (
            <div className="w-full text-center mt-10">
              <p className="text-muted-foreground">Loading genres...</p>
            </div>
          ) : (
            <div className="w-full h-fit rounded-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {genres.map((genre) => (
                <GenreCard
                  key={genre.name}
                  name={genre.name}
                  displayName={genre.displayName}
                  color={genre.color}
                  icon={genre.icon}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenresPage;

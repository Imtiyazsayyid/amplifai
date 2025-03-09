"use server";

import { Genre } from "@prisma/client";
import { prisma } from "../prisma";
import { verifyAndGetUser } from "./auth.actions";

// Get all available genres from the enum
export const getAllGenres = async (): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    // Get all genre values from the enum
    const genres = Object.values(Genre);

    // Create a formatted response with additional metadata for each genre
    const formattedGenres = genres.map((genre) => ({
      name: genre,
      // Format the display name (e.g., "HIPHOP" -> "Hip Hop")
      displayName: genre
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
      // We'll add color and icon information for UI display
      color: getGenreColor(genre),
      icon: getGenreIcon(genre),
    }));

    return { data: formattedGenres, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to fetch genres", status: false };
  }
};

// Get songs by genre
export const getSongsByGenre = async (genre: string): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    // Validate that the genre exists in our enum
    if (!Object.values(Genre).includes(genre as Genre)) {
      return { data: null, message: "Invalid genre", status: false };
    }

    // Get all songs with the specified genre
    const songs = await prisma.song.findMany({
      include: {
        artists: {
          include: {
            artist: true,
          },
        },
      },
      where: {
        genre: genre as Genre,
      },
    });

    // Get the songs liked by the current user
    const songsLikedByUser = await prisma.likedSong.findMany({
      where: {
        userId: user.userId,
      },
    });

    const likedSongIds = songsLikedByUser.map((song) => song.songId);

    // Add isLiked property to each song
    const songsWithLikeStatus = songs.map((song) => ({
      ...song,
      isLiked: likedSongIds.includes(song.songId),
    }));

    return { data: songsWithLikeStatus, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to fetch songs by genre", status: false };
  }
};

// Helper function to get a color for each genre
function getGenreColor(genre: string): string {
  const colorMap: Record<string, string> = {
    POP: "#FF4081", // Pink
    ROCK: "#8BC34A", // Light Green
    JAZZ: "#9C27B0", // Purple
    HIPHOP: "#FF9800", // Orange
    CLASSICAL: "#3F51B5", // Indigo
    REGGAE: "#4CAF50", // Green
    BLUES: "#2196F3", // Blue
    COUNTRY: "#FFC107", // Amber
    METAL: "#607D8B", // Blue Grey
    FOLK: "#795548", // Brown
    ELECTRONIC: "#00BCD4", // Cyan
    RAP: "#E91E63", // Pink
    RNB: "#673AB7", // Deep Purple
    SOUL: "#009688", // Teal
    PUNK: "#F44336", // Red
    DANCE: "#CDDC39", // Lime
    REGGAETON: "#FF5722", // Deep Orange
    SALSA: "#E91E63", // Pink
    BACHATA: "#9C27B0", // Purple
    MERENGUE: "#FFC107", // Amber
  };

  return colorMap[genre] || "#9E9E9E"; // Default to grey if genre not found
}

// Helper function to get an icon name for each genre
function getGenreIcon(genre: string): string {
  const iconMap: Record<string, string> = {
    POP: "music",
    ROCK: "guitar",
    JAZZ: "saxophone",
    HIPHOP: "microphone",
    CLASSICAL: "piano",
    REGGAE: "music",
    BLUES: "guitar",
    COUNTRY: "guitar",
    METAL: "guitar",
    FOLK: "guitar",
    ELECTRONIC: "headphones",
    RAP: "microphone",
    RNB: "music",
    SOUL: "music",
    PUNK: "guitar",
    DANCE: "music",
    REGGAETON: "music",
    SALSA: "music",
    BACHATA: "music",
    MERENGUE: "music",
  };

  return iconMap[genre] || "music"; // Default to music if genre not found
}

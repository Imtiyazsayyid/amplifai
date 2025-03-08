"use server";

import { prisma } from "../prisma";
import { verifyAndGetUser } from "./auth.actions";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generatePlaylistForUser = async (): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const userLikedSongs = await prisma.likedSong.findMany({
      where: {
        userId: user.userId,
      },
    });
    const songs = await prisma.song.findMany();
    const songArtistMap = await prisma.songArtistMap.findMany();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a music recommendation system. Based on the provided JSON data, recommend 5 songs that the user might like. Consider the user's liked songs, artist preferences, and similar patterns from the dataset.

    Your response **must be a raw JSON array** with:
    1. The first element as a **string** (the playlist name, give a creative and unique name).  
    2. The second element as a **string** (an image URL from one of the 5 songs).  
    3. The next 5 elements as **numbers** (the song IDs).  
    
    ### **Expected format (nothing else should be included):**
    [
      "Playlist Name",
      "Playlist Image URL",
      songId1,
      songId2,
      songId3,
      songId4,
      songId5
    ]
    
    ### **STRICT RULES:**
    - **DO NOT** add triple backticks (\`\`\`).  
    - **DO NOT** add "json" or any other markdown.  
    - **DO NOT** include explanations or extra text.  
    - **ONLY** return the raw JSON array, nothing else.
    
    ### **Example Output (What you must return exactly in raw JSON format):**
    ["Recommended for You", "https://example.com/song-image.jpg", 56, 57, 58, 59, 53]
    
    Here is the data:
    {
      "userLikedSongs": ${JSON.stringify(userLikedSongs)},
      "songs": ${JSON.stringify(songs)},
      "songArtistMap": ${JSON.stringify(songArtistMap)}
    }
    
    **ONLY return the JSON array. Nothing else.**`;

    const result = await model.generateContent(prompt);

    console.log({ d: result.response.text() });

    const dataArray = JSON.parse(result.response.text());

    const playListName = dataArray[0];
    const playListImage = dataArray[1];
    const songIds = dataArray.slice(2);

    const playlist = await prisma.playlist.create({
      data: {
        name: playListName,
        imgUrl: playListImage,
        userId: user.userId,
      },
    });

    const playlistSongs = await prisma.playlistSong.createMany({
      data: songIds.map((songId: number) => ({
        playlistId: playlist.playlistId,
        songId,
      })),
    });

    return { data: null, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

export const getAllPlaylists = async (): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const playlists = await prisma.playlist.findMany({
      where: {
        userId: user.userId,
      },
    });

    return { data: playlists, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

export const getAllSongsByPlaylistId = async (playlistId: number): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const songs = await prisma.playlistSong.findMany({
      include: {
        song: {
          include: {
            artists: {
              include: {
                artist: true,
              },
            },
          },
        },
      },
      where: {
        playlistId,
      },
    });

    return { data: songs.map((s) => s.song), message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

export const deletePlaylist = async (playlistId: number): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    // First check if the playlist belongs to the user
    const playlist = await prisma.playlist.findUnique({
      where: {
        playlistId,
      },
    });

    if (!playlist) {
      return { data: null, message: "Playlist not found", status: false };
    }

    if (playlist.userId !== user.userId) {
      return { data: null, message: "You don't have permission to delete this playlist", status: false };
    }

    // Delete all songs in the playlist first (due to foreign key constraints)
    await prisma.playlistSong.deleteMany({
      where: {
        playlistId,
      },
    });

    // Then delete the playlist
    await prisma.playlist.delete({
      where: {
        playlistId,
      },
    });

    return { data: null, message: "Playlist deleted successfully", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to delete playlist", status: false };
  }
};

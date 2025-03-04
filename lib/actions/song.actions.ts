"use server";

import { prisma } from "../prisma";
import { verifyAndGetUser } from "./auth.actions";

interface SongFilters {
  artistId?: number;
  search?: string;
  isLiked?: string;
}

export const getAllSongs = async (filters?: SongFilters): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    let where: any = {};

    if (filters?.artistId) {
      where = {
        ...where,
        artists: {
          some: {
            artistId: filters?.artistId,
          },
        },
      };
    }

    if (filters?.search) {
      where = {
        ...where,
        name: {
          contains: filters.search,
        },
      };
    }

    const songs = await prisma.song.findMany({
      include: {
        artists: {
          include: {
            artist: true,
          },
        },
      },
      where,
      // where: {
      //   artists: {
      //     every: {
      //       artistId: filters?.artistId,
      //     },
      //   },
      // },
      // where: {
      //   name: {
      //     contains: filters?.search,
      //   },
      // },
    });

    const songsLikedByUser = await prisma.likedSong.findMany({
      where: {
        userId: user.userId,
      },
    });

    const songIds = songsLikedByUser.map((song) => song.songId);

    let data = [];

    for (let song of songs) {
      data.push({
        ...song,
        isLiked: songIds.includes(song.songId),
      });
    }

    return { data, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

export const getSingleSong = async (songId: number): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const songs = await prisma.song.findUnique({
      include: {
        artists: {
          include: {
            artist: true,
          },
        },
      },
      where: {
        songId,
      },
    });

    return { data: songs, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

export const likeOrUnlikeSong = async (songId: number): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const isLiked = await prisma.likedSong.findFirst({
      where: {
        userId: user.userId,
        songId,
      },
    });

    if (isLiked) {
      await prisma.likedSong.deleteMany({
        where: {
          userId: user.userId,
          songId,
        },
      });
    } else {
      await prisma.likedSong.create({
        data: {
          songId,
          userId: user.userId,
        },
      });
    }

    return { data: null, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

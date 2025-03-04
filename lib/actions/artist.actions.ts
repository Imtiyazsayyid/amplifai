"use server";

import { prisma } from "../prisma";
import { verifyAndGetUser } from "./auth.actions";

interface ArtistFilters {
  search?: string;
}

export const getAllArtists = async (filters?: ArtistFilters): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    let where: any = {};

    if (filters?.search) {
      where = {
        ...where,
        name: {
          contains: filters.search,
        },
      };
    }

    const artists = await prisma.artist.findMany({
      include: {
        songs: true,
      },
      where,
    });

    return { data: artists, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

export const getSingleArtist = async (artistId: number): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const artist = await prisma.artist.findUnique({
      include: {
        songs: true,
      },
      where: {
        artistId,
      },
    });

    return { data: artist, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to ", status: false };
  }
};

"use server";

import { prisma } from "../prisma";
import { verifyAndGetUser } from "./auth.actions";
import { profileFormSchema } from "../zod-schemas";
import { z } from "zod";

export const getSingleUser = async (): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    return { data: user, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to get user details", status: false };
  }
};

export const getAllUsers = async (): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const users = await prisma.user.findMany({
      where: {
        status: true,
      },
    });

    return { data: users, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to get all users", status: false };
  }
};

export const saveUser = async (body: z.infer<typeof profileFormSchema>): Promise<ActionResponse> => {
  try {
    const res = await verifyAndGetUser();

    if (!res.status) {
      return { data: null, message: res.message, status: res.status };
    }

    const user = res.data;

    const data = {
      imgUrl: body.imgUrl,
      firstName: body.firstName,
      lastName: body.lastName,
    };

    const validation = profileFormSchema.safeParse(data);

    if (!validation.success) {
      return { data: null, message: validation.error.errors[0].message, status: false };
    }

    await prisma.user.update({
      data,
      where: {
        userId: user.userId,
      },
    });

    return { data: null, message: "Success", status: true };
  } catch (error) {
    console.log({ error });
    return { data: null, message: "Failed to Save Profile", status: false };
  }
};

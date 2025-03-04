"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

export const verifyAndGetUser = async (): Promise<ActionResponse> => {
  try {
    const clerkUser = await auth();
    if (clerkUser && clerkUser.userId) {
      const user = await prisma.user.findUnique({
        where: {
          clerkUserId: clerkUser.userId,
        },
      });

      if (user) {
        return { data: user, status: true, message: "Success" };
      }
    }

    return { data: null, status: false, message: "Authentication Failed" };
  } catch (error) {
    console.log({ error });
    return { data: null, status: false, message: "Authentication Failed" };
  }
};

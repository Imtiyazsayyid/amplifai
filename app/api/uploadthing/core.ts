import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth, currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  return { userId: user.id };
};

export const ourFileRouter = {
  serverImage: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

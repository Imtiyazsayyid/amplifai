import { prisma } from "@/lib/prisma";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    if (evt.type === "user.created") {
      const { id: clerkUserId, email_addresses, first_name, last_name, image_url, username } = evt.data;

      const existingUser = await prisma.user.findUnique({
        where: {
          clerkUserId,
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            clerkUserId,
            emailAddress: email_addresses[0].email_address,
            firstName: first_name || "",
            lastName: last_name || "",
            imgUrl: image_url || "",
          },
        });
      }
    }

    if (evt.type === "session.created") {
      const { user_id } = evt.data;
      const clerk = await clerkClient();

      const sessionUser = await prisma.user.findUnique({
        where: {
          clerkUserId: user_id,
        },
      });

      if (!sessionUser) {
        return;
      }

      let metaData = {
        appUserId: sessionUser.userId,
      };

      console.log({
        user_id,
        metaData,
      });

      await clerk.users.updateUser(user_id, {
        publicMetadata: metaData,
      });
    }
  } catch (err) {
    console.log("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  return new Response("Webhook received", { status: 200 });
}

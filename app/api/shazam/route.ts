import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

// ACRCloud credentials - you'll need to sign up for an account at https://www.acrcloud.com/
const ACR_HOST = process.env.ACR_HOST || "identify-ap-southeast-1.acrcloud.com";
const ACR_ACCESS_KEY = process.env.ACR_ACCESS_KEY || "";
const ACR_ACCESS_SECRET = process.env.ACR_ACCESS_SECRET || "";
const ACR_ENDPOINT = "/v1/identify";

export async function POST(req: NextRequest) {
  console.log("=== ACRCloud Song Detection API ===");

  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio") as Blob;

    if (!audioBlob) {
      console.log("No audio file provided in the request");
      return NextResponse.json({ status: false, message: "No audio file provided" }, { status: 400 });
    }

    // Log audio information
    console.log(`Audio blob size: ${audioBlob.size} bytes, type: ${audioBlob.type}`);

    if (audioBlob.size < 1000) {
      console.log("Audio file too small, please record longer");
      return NextResponse.json(
        { status: false, message: "Audio file too small, please record longer" },
        { status: 400 }
      );
    }

    // Check if ACRCloud credentials are set
    if (!ACR_ACCESS_KEY || !ACR_ACCESS_SECRET) {
      console.error("ACRCloud credentials not set in environment variables");
      return NextResponse.json({ status: false, message: "ACRCloud credentials not configured" }, { status: 500 });
    }

    try {
      // Convert blob to buffer
      const buffer = Buffer.from(await audioBlob.arrayBuffer());
      console.log(`Audio buffer size: ${buffer.length} bytes`);

      // Prepare the signature for ACRCloud following their example
      const timestamp = Math.floor(Date.now() / 1000);
      const stringToSign = `POST\n${ACR_ENDPOINT}\n${ACR_ACCESS_KEY}\naudio\n1\n${timestamp}`;

      const signature = crypto
        .createHmac("sha1", ACR_ACCESS_SECRET)
        .update(Buffer.from(stringToSign, "utf-8"))
        .digest()
        .toString("base64");

      // Create form data for the request exactly as in the example
      const form = new FormData();
      form.append("access_key", ACR_ACCESS_KEY);
      form.append("sample_bytes", buffer.length.toString());
      form.append("timestamp", timestamp.toString());
      form.append("signature", signature);
      form.append("data_type", "audio");
      form.append("signature_version", "1");
      form.append("sample", new Blob([buffer]));

      console.log("Sending request to ACRCloud...");

      // Make the request to ACRCloud
      const response = await axios.post(`https://${ACR_HOST}${ACR_ENDPOINT}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("ACRCloud response status:", response.status);

      // Process the response
      const result = response.data;

      if (
        result.status.code !== 0 ||
        !result.metadata ||
        !result.metadata.music ||
        result.metadata.music.length === 0
      ) {
        console.log("No song detected in the audio");
        return NextResponse.json(
          {
            status: false,
            message: "No song detected in the audio",
            data: result,
          },
          { status: 200 }
        );
      }

      // Extract the song information based on the example response format
      const music = result.metadata.music[0];
      console.log("Detected song:", music.title, "by", music.artists[0].name);

      // Format the response to match our expected format
      const formattedResult = {
        track: {
          title: music.title,
          subtitle: music.artists.map((a: any) => a.name).join(", "),
          sections: [
            {
              type: "SONG",
              metadata: [{ title: "Album", text: music.album?.name || "Unknown Album" }],
            },
          ],
          images: {
            // Try to get cover art from external metadata if available
            coverart: music.external_metadata?.spotify?.album?.id
              ? `https://i.scdn.co/image/ab67616d0000b273${music.external_metadata.spotify.album.id}`
              : undefined,
          },
        },
      };

      return NextResponse.json({ status: true, data: formattedResult }, { status: 200 });
    } catch (error) {
      console.error("Error processing audio:", error);
      return NextResponse.json(
        {
          status: false,
          message: "Error processing audio",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error detecting song:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error detecting song",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

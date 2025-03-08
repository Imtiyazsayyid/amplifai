"use client";

import StandardErrorToast from "@/components/custom/StandardErrorToast";
import StandardSuccessToast from "@/components/custom/StandardSuccessToast";
import { Button } from "@/components/ui/button";
import { Squares } from "@/components/ui/squares-background";
import { MicIcon, MusicIcon, PlayIcon, StopCircleIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const DetectPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSong, setDetectedSong] = useState<{
    title: string;
    artist: string;
    album?: string;
    coverArt?: string;
  } | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(15); // Default 15 seconds
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Check supported audio formats on component mount
  useEffect(() => {
    const formats: string[] = [];
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) formats.push("audio/webm;codecs=opus");
    if (MediaRecorder.isTypeSupported("audio/webm")) formats.push("audio/webm");
    if (MediaRecorder.isTypeSupported("audio/mp4")) formats.push("audio/mp4");
    if (MediaRecorder.isTypeSupported("audio/wav")) formats.push("audio/wav");
    if (MediaRecorder.isTypeSupported("audio/ogg")) formats.push("audio/ogg");
    setSupportedFormats(formats);
  }, []);

  const startRecording = async () => {
    try {
      setAudioUrl(null);
      setDetectedSong(null);

      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 44100, // Use standard sample rate
      });
      audioContextRef.current = audioContext;

      // Following the article's approach - use mono audio (single channel)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
          channelCount: 1, // Use mono audio (single channel) as in the article
        },
      });

      // Select the best supported format - prefer WAV if available
      let mimeType = "audio/wav";

      if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else {
        // Use default format
        mimeType = supportedFormats[0] || "audio/webm";
      }

      // Create media recorder with the selected format
      const options: MediaRecorderOptions = { mimeType };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create audio URL for testing playback
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        detectSong();
      };

      // Request data every second
      mediaRecorder.start(1000);
      setIsRecording(true);

      // Automatically stop recording after specified duration
      recordingTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording();
        }
      }, recordingDuration * 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      StandardErrorToast("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    // Close audio context if it exists
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  };

  const playRecordedAudio = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
    }
  };

  const detectSong = async () => {
    if (audioChunksRef.current.length === 0) {
      StandardErrorToast("No audio recorded");
      return;
    }

    try {
      setIsDetecting(true);
      // Use the same MIME type that was used for recording
      const mimeType = audioChunksRef.current[0].type || "audio/webm";
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      // Create a FormData object to send the audio
      const formData = new FormData();
      formData.append("audio", audioBlob);

      // Log the FormData for debugging
      console.log("Sending audio blob:", audioBlob);
      console.log("Audio blob type:", audioBlob.type);
      console.log("Audio blob size:", audioBlob.size);

      // Add a timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const startTime = Date.now();
        const response = await fetch("/api/shazam", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Full API response:", result);

        if (!result.status) {
          throw new Error(result.message || "Failed to detect song");
        }

        // Parse API response
        const songData = result.data?.track;

        if (songData) {
          // Extract the song information
          const title = songData.title || "Unknown Title";
          const artist = songData.subtitle || "Unknown Artist";
          let album: string | undefined = undefined;
          let coverArt: string | undefined = undefined;

          // Try to find album information
          if (songData.sections) {
            const albumSection = songData.sections.find((s: any) => s.type === "SONG");
            if (albumSection?.metadata) {
              const albumMeta = albumSection.metadata.find((m: any) => m.title === "Album");
              if (albumMeta) {
                album = albumMeta.text;
              }
            }
          }

          // Try to find cover art
          coverArt =
            songData.images?.coverart ||
            songData.share?.image ||
            songData.images?.background ||
            songData.image ||
            songData.artwork;

          setDetectedSong({
            title,
            artist,
            album,
            coverArt,
          });

          StandardSuccessToast("Song detected!");
        } else {
          StandardErrorToast("Could not identify the song. Please try again.");
          setDetectedSong(null);
        }
      } catch (fetchError: any) {
        if (fetchError.name === "AbortError") {
          throw new Error("Request timed out");
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error("Error detecting song:", error);
      StandardErrorToast("Error detecting song. Please try again.");
      setDetectedSong(null);
    } finally {
      setIsDetecting(false);
    }
  };

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
      <div className="flex justify-center h-full pt-10 md:pt-40 pb-10">
        <div className="w-full max-w-5xl flex flex-col gap-5 px-5 items-center">
          <div className="flex flex-col items-center mb-5">
            <MusicIcon className="h-16 w-16" />
            <h1 className="text-4xl font-bold text-center text-special mt-4">Detect Music</h1>
            <p className="text-center text-muted-foreground mt-2">
              Click the button below to listen and identify the song playing around you
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 mt-8">
            {/* Recording duration selector */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Recording duration:</span>
              <select
                value={recordingDuration}
                onChange={(e) => setRecordingDuration(Number(e.target.value))}
                className="bg-background border border-input rounded-md px-2 py-1 text-sm"
                disabled={isRecording || isDetecting}
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={20}>20 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>

            <Button
              size="lg"
              className={`rounded-full p-8 ${
                isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isDetecting}
            >
              {isRecording ? <StopCircleIcon className="h-12 w-12" /> : <MicIcon className="h-12 w-12" />}
            </Button>
            <p className="text-center text-muted-foreground">
              {isRecording
                ? `Listening... (will automatically stop after ${recordingDuration} seconds)`
                : isDetecting
                ? "Detecting song..."
                : "Tap to Listen"}
            </p>

            {audioUrl && (
              <div className="flex items-center gap-2">
                <audio ref={audioRef} src={audioUrl} className="hidden" />
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={playRecordedAudio}>
                  <PlayIcon className="h-4 w-4" />
                  Test Recorded Audio
                </Button>
                <span className="text-xs text-muted-foreground">(Play to check if audio was captured)</span>
              </div>
            )}
          </div>

          {detectedSong && (
            <div className="mt-12 p-6 bg-card rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-center mb-4">Detected Song</h2>

              {detectedSong.coverArt && (
                <div className="flex justify-center mb-4">
                  <img
                    src={detectedSong.coverArt}
                    alt={`${detectedSong.title} cover`}
                    className="w-48 h-48 object-cover rounded-md shadow-md"
                    onError={(e) => {
                      console.error("Error loading cover art:", e);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xl font-semibold">{detectedSong.title}</p>
                <p className="text-muted-foreground">{detectedSong.artist}</p>
                {detectedSong.album && <p className="text-sm text-muted-foreground">Album: {detectedSong.album}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectPage;

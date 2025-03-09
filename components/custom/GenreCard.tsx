"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Music, Guitar, Headphones, Mic, Piano, Radio, Disc, Drumstick } from "lucide-react";

interface GenreProps {
  name: string;
  displayName: string;
  color: string;
  icon: string;
}

const GenreCard = ({ name, displayName, color, icon }: GenreProps) => {
  const router = useRouter();

  // Function to get the appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case "guitar":
        return <Guitar className="h-8 w-8" />;
      case "headphones":
        return <Headphones className="h-8 w-8" />;
      case "microphone":
        return <Mic className="h-8 w-8" />;
      case "piano":
        return <Piano className="h-8 w-8" />;
      case "radio":
        return <Radio className="h-8 w-8" />;
      case "disc":
        return <Disc className="h-8 w-8" />;
      case "drumstick":
        return <Drumstick className="h-8 w-8" />;
      case "music":
      default:
        return <Music className="h-8 w-8" />;
    }
  };

  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center p-5 gap-3 transition-all duration-200 cursor-pointer hover:scale-105"
      style={{
        backgroundColor: `${color}20`, // Using 20% opacity version of the color
        borderColor: color,
        borderWidth: "2px",
      }}
      onClick={() => router.push(`/genres/${name}`)}
    >
      <div
        className="h-16 w-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}40` }} // Using 40% opacity version of the color
      >
        {getIcon()}
      </div>
      <p className="font-bold text-center text-lg">{displayName}</p>
    </div>
  );
};

export default GenreCard;

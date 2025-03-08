import {
  Disc3Icon,
  HeartIcon,
  HomeIcon,
  MenuIcon,
  MicVocalIcon,
  MusicIcon,
  SettingsIcon,
  RadioIcon,
} from "lucide-react";

export const navBarItems = [
  {
    path: "/",
    title: "Home",
    icon: HomeIcon,
  },
  {
    path: "/music",
    title: "Music",
    icon: MusicIcon,
  },
  // {
  //   path: "/play",
  //   title: "Play",
  //   icon: Disc3Icon,
  // },
  {
    path: "/artists",
    title: "Artists",
    icon: MicVocalIcon,
  },
  {
    path: "/detect",
    title: "Detect",
    icon: RadioIcon,
  },
  {
    path: "/liked-songs",
    title: "Liked",
    icon: HeartIcon,
  },
  {
    path: "/playlists/",
    title: "Playlist",
    icon: MenuIcon,
  },
  {
    path: "/settings/",
    title: "Settings",
    icon: SettingsIcon,
  },
];

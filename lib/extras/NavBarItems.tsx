import {
  BellIcon,
  Building2Icon,
  CircleDollarSignIcon,
  DollarSignIcon,
  HomeIcon,
  MessageCircleIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
  UserCircleIcon,
  WalletIcon,
} from "lucide-react";

export const navBarItems = [
  {
    path: "/",
    title: "Home",
    icon: HomeIcon,
  },
  {
    path: "/organizations",
    title: "Organizations",
    icon: Building2Icon,
  },
  {
    path: "/organizations/finances",
    title: "Finances",
    icon: DollarSignIcon,
  },
  {
    path: "/organizations/conversations",
    title: "Conversations",
    icon: MessageCircleIcon,
  },
  // {
  //   path: "/search",
  //   title: "Search",
  //   icon: SearchIcon,
  // },
  // {
  //   path: "/post",
  //   title: "Post",
  //   icon: PlusCircleIcon,
  // },
  {
    path: "/organizations/settings",
    title: "Settings",
    icon: SettingsIcon,
  },
  {
    path: "/organizations/notifications",
    title: "Notifications",
    icon: BellIcon,
  },
];

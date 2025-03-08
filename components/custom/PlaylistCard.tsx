"use client";

import { ALT_PROFILE_URL } from "@/lib/constants";
import { deletePlaylist } from "@/lib/actions/playlist.actions";
import { Artist, Playlist } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import StandardSuccessToast from "./StandardSuccessToast";
import StandardErrorToast from "./StandardErrorToast";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  playlist: Playlist;
  onDelete?: () => void;
}

const PlaylistCard = ({ playlist, onDelete }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setIsDeleting(true);

    try {
      const res = await deletePlaylist(playlist.playlistId);

      if (res.status) {
        StandardSuccessToast("Playlist deleted successfully");
        if (onDelete) {
          onDelete();
        }
      } else {
        StandardErrorToast(res.message || "Failed to delete playlist");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      StandardErrorToast("An error occurred while deleting the playlist");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    router.push("/playlists/" + playlist.playlistId);
  };

  return (
    <div className="bg-primary/50 rounded-xl flex flex-col items-center justify-center p-5 gap-2 hover:bg-primary/80 transition-all duration-200 relative group">
      <div className="absolute inset-0 cursor-pointer" onClick={handleCardClick} />

      <div className="h-20 w-20 rounded-full bg-primary relative z-10">
        <img
          src={playlist.imgUrl || ALT_PROFILE_URL}
          className="h-full w-full object-cover rounded-full"
          alt={playlist.name}
        />
      </div>

      <p className="font-bold text-center">{playlist.name}</p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the playlist "{playlist.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlaylistCard;

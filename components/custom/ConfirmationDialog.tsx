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
import { useClerk } from "@clerk/nextjs";
import React from "react";

interface Props {
  confirmAction: () => void;
  children: React.ReactNode;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationDialog = ({
  confirmAction,
  children,
  title,
  description,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}: Props) => {
  const { signOut } = useClerk();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button>{children}</button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-96 rounded-lg" onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          ></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-primary"
            onClick={(e) => {
              confirmAction();
            }}
          >
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

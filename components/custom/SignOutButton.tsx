import { useClerk } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";

const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    <ConfirmationDialog
      confirmAction={() =>
        signOut({
          redirectUrl: "/",
        })
      }
      title="Leaving so soon?"
      description="You can join us back at any time.<br/>Hope to see you soon!"
      confirmButtonText="Log out"
    >
      <div className="transition-all hover:bg-primary text-secondary hover:text-rose-500 t p-1 rounded-lg">
        <LogOutIcon className="h-5 w-5 ransition-all cursor-pointer" />
      </div>
    </ConfirmationDialog>
  );
};

export default SignOutButton;

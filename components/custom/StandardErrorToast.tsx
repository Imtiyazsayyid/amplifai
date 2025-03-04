import { toast } from "sonner";
import { AlertCircleIcon } from "lucide-react";

export default function StandardErrorToast(title?: string, message?: string) {
  toast.error(title || "Uh oh! Something went wrong.");

  // , {
  //   description: message || "There was a problem with your request.",
  //   action: <AlertCircleIcon className="text-red-500" />,
  // }
}

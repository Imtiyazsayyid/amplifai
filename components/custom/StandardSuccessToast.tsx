import { toast } from "sonner";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";

export default function StandardSuccessToast(title?: string, message?: string) {
  toast(title || "Success!", {
    description: message || "Your Request Was Processed Successfully!",
    action: <CheckCircleIcon className="text-green-500" />,
  });
}

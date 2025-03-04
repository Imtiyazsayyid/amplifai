import { toast } from "@/hooks/use-toast";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";

export default function StandardSuccessToast(title?: string, message?: string) {
  toast({
    title: title || "Succuess!",
    description: message || "Your Request Was Processed Successfully!",
    action: <CheckCircleIcon className="text-green-500" />,
  });
}

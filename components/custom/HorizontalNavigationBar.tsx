import { User } from "@prisma/client";
import { PanelLeftOpen } from "lucide-react";
import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: User;
}

const HorizontalNavigationBar = ({ open, setOpen, user }: Props) => {
  return (
    <div
      className={`absolute z-10 top-0 left-0 border-b h-14 border-b-zinc-950 bg-background w-full md:hidden flex justify-between items-center px-4 ${
        open && "opacity-10 md:opacity-100"
      } `}
    >
      <div className="transition-all hover:bg-primary w-fit text-secondary hover:text-white p-1 rounded-lg">
        <PanelLeftOpen className="h-5 w-5 transition-all cursor-pointer" onClick={() => setOpen(true)} />
      </div>

      {user?.imgUrl && <Image height={400} width={400} alt="" src={user.imgUrl} className="w-8 h-8 rounded-full" />}
      {/* <UserButton /> */}
    </div>
  );
};

export default HorizontalNavigationBar;

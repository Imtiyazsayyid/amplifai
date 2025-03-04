"use client";

import { navBarItems } from "@/lib/extras/NavBarItems";
import { getSingleUser } from "@/lib/actions/user.actions";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignOutButton from "./SignOutButton";
import StandardErrorToast from "./StandardErrorToast";
import { ALT_PROFILE_URL } from "@/lib/constants";
import Image from "next/image";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: User;
}

const VerticalNavigationBar = ({ open, setOpen, user }: Props) => {
  const currentPath = usePathname();
  const router = useRouter();

  const isCurrentPath = (path: string) => {
    return path === currentPath;
  };

  const getAnimationStyles = () => {
    if (open) {
      return { width: "300px", maxWidth: "300px" };
    } else {
      return { width: "60px", maxWidth: "60px", alignItems: "center" };
    }
  };

  return (
    <motion.div
      animate={getAnimationStyles()}
      className={`border-r-[0.5px] absolute md:static z-20 border-zinc-900 bg-background h-full w-80 flex flex-col p-4 pt-6 ${
        !open && "max-w-20 pt-4"
      }`}
    >
      {open && (
        <div className="flex w-full justify-between pb-2">
          <div className="flex gap-1 items-center">
            <div className="flex gap-2 items-center">
              {user?.imgUrl && (
                <Image height={400} width={400} alt="" src={user?.imgUrl || ""} className="w-7 h-7 rounded-full" />
              )}
              {open && (
                <div className="max-w-44">
                  <p className="truncate font-bold">{user?.emailAddress}</p>
                </div>
              )}
            </div>
          </div>

          <div className="transition-all hover:bg-primary text-secondary hover:text-white p-1 rounded-lg w-fit h-fit">
            <PanelLeftClose className="h-5 w-5 ransition-all cursor-pointer" onClick={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* <div className={`border-t border-zinc-900 ${open && "mb-3 mt-2"}`}></div> */}

      {!open && (
        <div className="transition-all hover:bg-primary text-secondary hover:text-white p-1 mb-3 rounded-lg">
          <PanelLeftOpen className="h-5 w-5 ransition-all cursor-pointer" onClick={() => setOpen(true)} />
        </div>
      )}

      {!open && (
        <div className="hidden md:block mb-1">
          <div className="flex gap-1 items-end mb-3">
            {user ? (
              <Image
                height={400}
                width={400}
                alt=""
                src={user.imgUrl || ALT_PROFILE_URL}
                className="w-8 max-w-8 rounded-full bg-primary"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary"></div>
            )}
          </div>
        </div>
      )}

      <div className={`w-full mb-2 ${open && "mt-2 mb-3"}`}>
        <div className={`border-t w-full border-zinc-900`}></div>
      </div>

      <div className="flex flex-col h-full gap-2">
        {navBarItems.map((i) => {
          const currentPath: boolean = isCurrentPath(i.path);

          return (
            <div
              key={i.path}
              className={`w-full h-10 transition-all rounded-lg flex gap-2 items-center px-3 cursor-pointer text-zinc-300  ${
                currentPath ? "bg-primary text-black" : "hover:bg-primary/40 hover:text-white hover:font-bold"
              }`}
              onClick={() => {
                router.push(i.path);
                if (window.innerWidth < 768) {
                  setOpen(false);
                }
              }}
            >
              {/* {i.icon} */}
              <i.icon className="w-4 h-4" />
              {open && <p className={`text-md ${currentPath && "font-bold"}`}>{i.title}</p>}
            </div>
          );
        })}
      </div>

      <div className={`w-full ${open && "mt-2 mb-3"}`}>
        <div className={`border-t w-full border-zinc-900`}></div>
      </div>
      <div className="flex justify-between mt-3 items-center mb-10">
        <div className="flex gap-1 items-center">
          <Image height={400} width={400} alt="" src="/nova-3.png" className="w-7 max-w-7 rounded-full" />
        </div>
        {open && <SignOutButton />}
      </div>
      <div className="flex justify-center mt-2"></div>
    </motion.div>
  );
};

export default VerticalNavigationBar;

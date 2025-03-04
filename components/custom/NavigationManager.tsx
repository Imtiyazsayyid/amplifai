"use client";

import React, { useEffect, useState } from "react";
import HorizontalNavigationBar from "./HorizontalNavigationBar";
import VerticalNavigationBar from "./VerticalNavigationBar";
import { User } from "@prisma/client";
import { getSingleUser } from "@/lib/actions/user.actions";
import StandardErrorToast from "./StandardErrorToast";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const NavigationManager = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const router = useRouter();

  const fetchSingleUser = async () => {
    try {
      const res = await getSingleUser();
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Oops! Something went wrong", res.message);
        if (res.access === false) {
          router.push("/organizations");
        }

        return;
      }

      setUser(res.data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, []);

  return (
    <div className="w-full h-full flex relative">
      <HorizontalNavigationBar open={open} setOpen={setOpen} user={user} />

      <div className={`${!open && "hidden"} md:flex`}>
        <VerticalNavigationBar open={open} setOpen={setOpen} user={user} />
      </div>
      <div
        className={`w-full h-full max-h-full pt-16 md:pt-0 overflow-hidden overflow-y-auto ${
          open && "opacity-10 md:opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default NavigationManager;

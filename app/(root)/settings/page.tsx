"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "./ProfileForm";

const SettingsPage = () => {
  return (
    <div className="flex justify-center h-full w-full pt-20">
      <Tabs defaultValue="profile" className="w-full flex flex-col items-center">
        <TabsList className="justify-center w-fit border-none gap-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="w-full h-full max-w-5xl">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

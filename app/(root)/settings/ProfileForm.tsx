"use client";

import StandardErrorToast from "@/components/custom/StandardErrorToast";
import { getSingleUser, saveUser } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadSingleFile } from "@/lib/upload-thing-client";
import { profileFormSchema } from "@/lib/zod-schemas";
import { Loader2Icon } from "lucide-react";
import StandardSuccessToast from "@/components/custom/StandardSuccessToast";
import { ALT_PROFILE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ProfileForm = () => {
  const [isUploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      imgUrl: "",
      emailAddress: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setLoading(true);
      const res = await saveUser(values);
      if (!res.status) {
        console.log({ error: res.message });
        StandardErrorToast("Failed to Save Profile");
        if (res.access === false) {
          router.push("/organizations");
        }
        return;
      } else {
        StandardSuccessToast("Profile Saved!");
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

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

      const user = res.data;

      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imgUrl: user.imgUrl || "",
        emailAddress: user.emailAddress || "",
      });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center py-10 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col justify-center items-center px-5">
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem className="mb-10">
                <div className="flex w-full justify-center">
                  <label htmlFor="imgUpload" className="cursor-pointer">
                    {isUploading ? (
                      <div className="h-40 w-40 rounded-full bg-primary flex justify-center items-center">
                        <Loader2Icon className="animate-spin text-secondary" />
                      </div>
                    ) : (
                      <Image
                        height={400}
                        width={400}
                        alt=""
                        src={field.value || ALT_PROFILE_URL}
                        className="h-40 w-40 rounded-full object-cover"
                      />
                    )}
                  </label>

                  <input
                    id="imgUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploading(true);
                        try {
                          const res = await uploadSingleFile(file);
                          if (res.status) {
                            form.setValue("imgUrl", res.data);
                          } else {
                            StandardErrorToast("Oops! Something went wrong", res.message);
                          }
                        } catch (error) {
                          StandardErrorToast("Oops! Something went wrong", "Your image was not uploaded");
                        } finally {
                          setUploading(false);
                        }
                      }
                    }}
                  />
                </div>
              </FormItem>
            )}
          ></FormField>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-6 w-full">
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" className="w-full" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center mt-16 gap-2">
            <Button type="button" className="w-fit" variant={"outline"}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isUploading} className="w-fit">
              Submit {loading && <Loader2Icon className="animate-spin h-3 w-3" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;

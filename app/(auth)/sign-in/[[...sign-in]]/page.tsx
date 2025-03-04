import { WavyBackground } from "@/components/aceternity/wavy-background";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-full flex flex-col justify-center items-center bg-background">
      <WavyBackground className="max-w-4xl mx-auto" colors={["#0d1f2b", "#4d7a7a", "#ffffff"]}>
        <SignIn
          appearance={{
            layout: {
              logoImageUrl: "/nova-3.png",
              logoPlacement: "inside",
            },
          }}
        />
      </WavyBackground>
    </div>
  );
}

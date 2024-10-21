import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
                <Image
                    src={'/signin.webp'}
                    alt="signin"
                    width={400}
                    height={400}
                    // className="w-full object-contain"
                />
            </div>
        <div className="flex justify-center items-center h-screen">
          <SignIn />
        </div>
      </div>
    );
}

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-12 items-center justify-between">
      <div className="pl-3 text-2xl font-bold text-[#47596b]">GiftMe</div>
      {sessionData && (
        <button
          className="mr-4  flex justify-between rounded-md px-2 py-[3px] text-[#47596b] hover:bg-[#86A6C6]"
          onClick={() => signOut()}
        >
          {sessionData.user?.image && (
            <div className=" flex items-center justify-center gap-1">
              <div className="text-sm ">Sign Out</div>
              <div></div>
              <div className=" overflow-hidden">
                <Image
                  src={sessionData.user.image}
                  alt="profile"
                  width={37}
                  height={37}
                  className="rounded-full"
                />
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
}

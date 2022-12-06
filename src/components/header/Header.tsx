import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex h-12 items-center justify-between">
      <div className="pl-3 text-2xl font-bold text-[#47596b]">GiftMe</div>
      {sessionData && (
        <div className="flex">
          {sessionData.user?.image && (
            <div className="mr-4 flex items-center justify-center gap-1">
              <button
                className="text-sm text-[#47596b] hover:underline"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
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
        </div>
      )}
    </div>
  );
}

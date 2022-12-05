import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import MyGifts from "../my-gifts/MyGifts";

type Views = "MY_GIFTS" | "FRIEND_GIFTS";

export default function Main() {
  const { data: sessionData } = useSession();

  const [selectedUserId, setSelectedUserId] = useState(
    sessionData?.user?.id ?? ""
  );
  const [selectedView, setSelectedView] = useState<Views>("MY_GIFTS");

  return (
    <div className="mt-20 flex justify-center gap-5">
      <div className=" flex h-min w-[200px] flex-col gap-2 divide-y rounded-lg bg-white p-4 shadow-md">
        <div
          className={`cursor-pointer rounded-md px-3 py-1 text-xl hover:bg-[#6C8CAC] hover:text-white ${
            selectedView === "MY_GIFTS" && "bg-[#6C8CAC] text-white"
          }`}
        >
          My List
        </div>
        <div>Family Lists</div>
      </div>
      <div className=" h-min w-[700px] rounded-lg bg-white p-4 shadow-md">
        {selectedView === "MY_GIFTS" && <MyGifts />}
      </div>
    </div>
  );
}

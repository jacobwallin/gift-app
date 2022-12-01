import { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import Gift from "./Gift";

export default function Main() {
  const { data } = trpc.gifts.getAll.useQuery();
  const { data: sessionData } = useSession();

  const [selectedUserId, setSelectedUserId] = useState(
    sessionData?.user?.id ?? ""
  );

  return (
    <div className="mt-20 flex justify-center gap-5">
      <div className=" flex min-h-[400px] w-[175px] flex-col rounded-lg bg-white p-4 shadow-md">
        <div className="text-xl">My List</div>
        <div>Family Lists</div>
      </div>
      <div className="flex flex-col gap-4 ">
        <div className="border-1 border-gray flex h-[40px] w-[600px] flex-col rounded-lg bg-sky-700 shadow-md">
          Filter / Action Bar
        </div>
        <div className="border-1 border-gray flex w-[600px] flex-col rounded-lg bg-white shadow-md">
          <Gift />
          <Gift />
          <Gift />
        </div>
      </div>
    </div>
  );
}

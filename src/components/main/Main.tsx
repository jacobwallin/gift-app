import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { RouterOutputs } from "../../utils/trpc";
import MyGifts from "../my-gifts/MyGifts";
import FriendsGifts from "../friend-gifts/FriendGifts";
import Image from "next/image";

type Views = "MY_GIFTS" | "MY_LIST" | "FRIEND_GIFTS";

export default function Main() {
  const { data: sessionData } = useSession();
  const userQuery = trpc.users.getAll.useQuery();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedView, setSelectedView] = useState<Views>("MY_LIST");

  function selectFriendsGiftList(userId: string, userName: string) {
    setSelectedView("FRIEND_GIFTS");
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  }

  function selectMyList() {
    setSelectedView("MY_LIST");
    setSelectedUserId("");
  }

  function selectMyGifts() {
    setSelectedView("MY_GIFTS");
    setSelectedUserId("");
  }

  return (
    <div className="mt-20 flex justify-center gap-5">
      <div className=" flex h-min w-[250px] flex-col gap-2  rounded-lg bg-white p-3 shadow-md">
        <div
          className={`cursor-pointer rounded-md px-3 py-1 text-xl ${
            selectedView === "MY_LIST"
              ? "bg-[#6C8CAC] text-white "
              : "hover:bg-[#6C8CAC] hover:text-white"
          }`}
          onClick={() => selectMyList()}
        >
          My List
        </div>
        <div
          className={`cursor-pointer rounded-md px-3 py-1 text-xl ${
            selectedView === "MY_GIFTS"
              ? "bg-[#6C8CAC] text-white "
              : "hover:bg-[#6C8CAC] hover:text-white"
          }`}
          onClick={() => selectMyGifts()}
        >
          My Gifts
        </div>
        <div className="border"></div>
        <div className="flex flex-col gap-2">
          {userQuery.data && (
            <UserListMenuItems
              users={userQuery.data}
              selectedUserId={selectedUserId}
              selectFriendsGiftList={selectFriendsGiftList}
            />
          )}
        </div>
      </div>
      <div className=" h-min w-[700px] rounded-lg bg-white p-4 shadow-md ">
        {selectedView === "MY_LIST" && <MyGifts />}
        {selectedView === "FRIEND_GIFTS" && selectedUserId !== "" && (
          <FriendsGifts
            userId={selectedUserId}
            userShortName={selectedUserName}
          />
        )}
      </div>
    </div>
  );
}

interface UserListMenuItemProps {
  users: RouterOutputs["users"]["getAll"];
  selectedUserId: string;
  selectFriendsGiftList: (userId: string, userName: string) => void;
}

function UserListMenuItems(props: UserListMenuItemProps) {
  const { users, selectedUserId, selectFriendsGiftList } = props;
  return (
    <>
      {users.map((user) => {
        const userShortName = user.name ? user.name.split(" ")[0] : "Friend";
        return (
          <div
            key={user.id}
            onClick={() => selectFriendsGiftList(user.id, userShortName || "")}
            className={`flex cursor-pointer items-center justify-start gap-2 rounded-md px-3 py-1 text-xl ${
              selectedUserId === user.id
                ? "bg-[#6C8CAC] text-white "
                : "hover:bg-[#6C8CAC] hover:text-white"
            }`}
          >
            {user.image && (
              <div>
                <Image
                  src={user.image}
                  width={35}
                  height={35}
                  alt=""
                  className="rounded-full"
                />
              </div>
            )}
            <div>{`${userShortName}'s List`}</div>
          </div>
        );
      })}
    </>
  );
}

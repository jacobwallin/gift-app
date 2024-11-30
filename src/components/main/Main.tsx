import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { RouterOutputs } from "../../utils/trpc";
import MyList from "../my-list/MyList";
import FriendsGifts from "../friend-gifts/FriendGifts";
import MyGifts from "../my-gifts/MyGifts";
import Image from "next/image";
import DropdownWhiteIcon from "../../../public/down-white.png";
import SnowAnimation from "./SnowAnimation";

type Views = "MY_GIFTS" | "MY_LIST" | "FRIEND_GIFTS";

export default function Main() {
  const userQuery = trpc.users.getAll.useQuery();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedView, setSelectedView] = useState<Views>("MY_LIST");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<{
    image: string | null;
    title: string;
  }>({ image: "", title: "My List" });

  function selectFriendsGiftList(
    userId: string,
    userName: string,
    image: string | null
  ) {
    setSelectedView("FRIEND_GIFTS");
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setShowMobileMenu(false);
    setSelectedMenuItem({
      image,
      title: `${userName}'s List`,
    });
  }

  function selectMyList() {
    setSelectedView("MY_LIST");
    setSelectedUserId("");
    setShowMobileMenu(false);
    setSelectedMenuItem({
      image: null,
      title: `My List`,
    });
  }

  function selectMyGifts() {
    setSelectedView("MY_GIFTS");
    setSelectedUserId("");
    setShowMobileMenu(false);
    setSelectedMenuItem({
      image: null,
      title: `My Gifts`,
    });
  }

  function toggleMobileMenu() {
    setShowMobileMenu(!showMobileMenu);
  }

  return (
    <div className="mt-6 flex flex-col justify-center gap-2 px-1 md:mt-20 md:flex-row md:gap-5">
      <SnowAnimation />
      <div className="relative md:hidden">
        <div className=" w-max min-w-[175px] flex-col rounded-lg bg-[#537393] p-1 text-white shadow-md hover:bg-[#395979]">
          <div
            className={`flex h-[37px] cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1 text-base`}
            onClick={() => toggleMobileMenu()}
          >
            <div className="flex items-center gap-2">
              <div>
                {selectedMenuItem.image && (
                  <Image
                    src={selectedMenuItem.image}
                    width={35}
                    height={35}
                    alt=""
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="text-lg font-medium">
                {selectedMenuItem.title}
              </div>
            </div>
            <div
              className={`transition-all ${
                showMobileMenu ? "rotate-180 transition-all" : ""
              }`}
            >
              <Image src={DropdownWhiteIcon} width={17} height={17} alt="" />
            </div>
          </div>
        </div>
        <div
          className={`absolute top-[49px] z-10 h-min w-[250px] min-w-[250px] flex-col gap-2 rounded-lg border border-gray-300  bg-white p-2 text-lg shadow-md  ${
            showMobileMenu ? "flex" : "hidden"
          }`}
        >
          <div
            className={`cursor-pointer rounded-md px-3 py-1  ${
              selectedView === "MY_LIST"
                ? "bg-[#86A6C6] text-white "
                : "hover:bg-[#ddd]"
            }`}
            onClick={selectMyList}
          >
            My List
          </div>
          <div
            className={`cursor-pointer rounded-md px-3 py-1  ${
              selectedView === "MY_GIFTS"
                ? "bg-[#86A6C6] text-white "
                : "hover:bg-[#ddd] "
            }`}
            onClick={selectMyGifts}
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
      </div>
      <div className="hidden h-min w-[275px] min-w-[275px] flex-col gap-2 rounded-lg  bg-white p-3 shadow-md md:flex">
        <div
          className={`cursor-pointer rounded-md px-3 py-1 text-xl ${
            selectedView === "MY_LIST"
              ? "bg-[#86A6C6] text-white "
              : "hover:bg-[#ddd]"
          }`}
          onClick={selectMyList}
        >
          My List
        </div>
        <div
          className={`cursor-pointer rounded-md px-3 py-1 text-xl ${
            selectedView === "MY_GIFTS"
              ? "bg-[#86A6C6] text-white "
              : "hover:bg-[#ddd] "
          }`}
          onClick={selectMyGifts}
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

      <div className=" h-min w-full max-w-[700px] rounded-lg bg-white p-2 shadow-md sm:p-4 ">
        {selectedView === "MY_LIST" && <MyList />}
        {selectedView === "FRIEND_GIFTS" && selectedUserId !== "" && (
          <FriendsGifts
            userId={selectedUserId}
            userShortName={selectedUserName}
          />
        )}
        {selectedView === "MY_GIFTS" && <MyGifts />}
      </div>
    </div>
  );
}

interface UserListMenuItemProps {
  users: RouterOutputs["users"]["getAll"];
  selectedUserId: string;
  selectFriendsGiftList: (
    userId: string,
    userName: string,
    image: string | null
  ) => void;
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
            onClick={() =>
              selectFriendsGiftList(user.id, userShortName || "", user.image)
            }
            className={`flex cursor-pointer items-center justify-start gap-2 rounded-md px-3 py-1 text-lg md:text-xl ${
              selectedUserId === user.id
                ? "bg-[#86A6C6] text-white "
                : "h hover:bg-[#ddd]"
            }`}
          >
            {user.image && (
              <div className="h-max min-h-max w-max min-w-max">
                <Image
                  src={user.image}
                  width={35}
                  height={35}
                  alt=""
                  className="rounded-full"
                />
              </div>
            )}
            <div className="break-all">{`${userShortName}'s List`}</div>
          </div>
        );
      })}
    </>
  );
}

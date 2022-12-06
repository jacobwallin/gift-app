import { useState, useEffect } from "react";
import GiftRow from "../gift/GiftRow";
import Gift from "../gift/Gift";
import { trpc } from "../../utils/trpc";
import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";

interface Props {
  userId: string;
  userShortName: string;
}

export default function FriendGifts(props: Props) {
  const { userId, userShortName } = props;
  const [showForm, setShowForm] = useState(false);
  const giftsQuery = trpc.gifts.getAllByUser.useQuery({ userId: userId });

  const [selectedGift, setSelectedGift] = useState<
    RouterOutputs["gifts"]["create"] | undefined
  >(undefined);

  function viewGift(gift: RouterOutputs["gifts"]["create"]) {
    setSelectedGift(gift);
  }
  function closeGiftView() {
    setSelectedGift(undefined);
  }

  return (
    <>
      <>
        {giftsQuery.isLoading ? (
          <div>loading...</div>
        ) : selectedGift !== undefined ? (
          <Gift gift={selectedGift} closeView={closeGiftView} />
        ) : (
          <>
            <div className="mb-8 flex flex-row justify-between">
              <h1 className="text-xl font-medium">{`${userShortName}'s Wish List`}</h1>
            </div>
            <div className="flex flex-col items-center divide-y">
              {giftsQuery.data?.map((gift) => {
                return <GiftRow key={gift.id} gift={gift} view={viewGift} />;
              })}
              {giftsQuery.data?.length === 0 && (
                <div className="text-[#999]">
                  {"You haven't added any gifts yet"}
                </div>
              )}
            </div>
          </>
        )}
      </>
    </>
  );
}

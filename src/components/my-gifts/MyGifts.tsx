import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import GiftRow from "../gift/GiftRow";
import Gift from "../gift/Gift";
import { trpc } from "../../utils/trpc";
import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";

export default function MyGifts() {
  const { data: sessionData } = useSession();
  const giftsQuery = trpc.gifts.getMyGifts.useQuery();
  const releaseGiftMutation = trpc.gifts.release.useMutation();

  const [gifts, setGifts] = useState<RouterOutputs["gifts"]["getMyGifts"]>([]);
  const [selectedGift, setSelectedGift] = useState<
    RouterOutputs["gifts"]["create"] | undefined
  >(undefined);
  const [claimedGiftId, setClaimedGiftId] = useState("");
  const [releasedGiftId, setReleasedGiftId] = useState("");

  useEffect(() => {
    setGifts(giftsQuery.data || []);
  }, [giftsQuery.data]);

  function viewGift(gift: RouterOutputs["gifts"]["create"]) {
    setSelectedGift(gift);
  }
  function closeGiftView() {
    setSelectedGift(undefined);
  }

  function releaseGift(giftId: string) {
    setReleasedGiftId(giftId);
    releaseGiftMutation.mutate({ giftId: giftId });
  }

  useEffect(() => {
    if (releaseGiftMutation.status === "success") {
      if (releaseGiftMutation.data.count > 0) {
        setGifts(
          gifts.map((gift) => {
            if (gift.id === releasedGiftId) {
              return {
                ...gift,
                claimedByUserId: null,
              };
            }
            return gift;
          })
        );
        if (selectedGift) {
          setSelectedGift({
            ...selectedGift,
            claimedByUserId: null,
          });
        }
      }
    }
  }, [releaseGiftMutation.status, releasedGiftId]);

  return (
    <>
      <>
        {giftsQuery.isLoading ? (
          <div>loading...</div>
        ) : selectedGift !== undefined ? (
          <Gift
            gift={selectedGift}
            closeView={closeGiftView}
            releaseGift={releaseGift}
            loadingRelease={releaseGiftMutation.isLoading}
          />
        ) : (
          <>
            <div className="mb-8 flex flex-row justify-between">
              <h1 className="text-xl font-medium">My Gifts</h1>
            </div>
            <div className="flex flex-col items-center divide-y">
              {gifts.map((gift) => {
                const userShortName = gift.user.name
                  ? gift.user.name.split(" ")[0]
                  : "Friend";
                return (
                  <GiftRow
                    key={gift.id}
                    gift={gift}
                    view={viewGift}
                    hideStatus={true}
                    user={{
                      name: userShortName || "",
                      image: gift.user.image || "",
                    }}
                  />
                );
              })}
              {gifts.length === 0 && (
                <div className="text-[#999]">
                  {"You haven't claimed any gifts yet"}
                </div>
              )}
            </div>
          </>
        )}
      </>
    </>
  );
}

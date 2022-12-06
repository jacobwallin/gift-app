import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  const { data: sessionData } = useSession();
  const [showForm, setShowForm] = useState(false);
  const giftsQuery = trpc.gifts.getAllByUser.useQuery({ userId: userId });
  const claimGiftMutation = trpc.gifts.claim.useMutation();
  const releaseGiftMutation = trpc.gifts.release.useMutation();

  const [gifts, setGifts] = useState<RouterOutputs["gifts"]["getAllByUser"]>(
    []
  );
  const [selectedGift, setSelectedGift] = useState<
    RouterOutputs["gifts"]["create"] | undefined
  >(undefined);
  const [claimedGiftId, setClaimedGiftId] = useState("");
  const [releasedGiftId, setReleasedGiftId] = useState("");

  useEffect(() => {
    setGifts(giftsQuery.data || []);
  }, [giftsQuery.data]);

  useEffect(() => {
    setSelectedGift(undefined);
  }, [userId]);

  function viewGift(gift: RouterOutputs["gifts"]["create"]) {
    setSelectedGift(gift);
  }
  function closeGiftView() {
    setSelectedGift(undefined);
  }
  function claimGift(giftId: string) {
    setClaimedGiftId(giftId);
    claimGiftMutation.mutate({ giftId: giftId });
  }
  function releaseGift(giftId: string) {
    setReleasedGiftId(giftId);
    releaseGiftMutation.mutate({ giftId: giftId });
  }
  useEffect(() => {
    if (claimGiftMutation.status === "success") {
      if (claimGiftMutation.data.count > 0) {
        setGifts(
          gifts.map((gift) => {
            if (gift.id === claimedGiftId) {
              return {
                ...gift,
                claimedByUserId: sessionData?.user?.id || null,
              };
            }
            return gift;
          })
        );
        if (selectedGift) {
          setSelectedGift({
            ...selectedGift,
            claimedByUserId: sessionData?.user?.id || null,
          });
        }
      }
    }
  }, [claimGiftMutation.status, claimedGiftId]);

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
            claimGift={claimGift}
            releaseGift={releaseGift}
            loadingClaim={claimGiftMutation.isLoading}
            loadingRelease={releaseGiftMutation.isLoading}
          />
        ) : (
          <>
            <div className="mb-8 flex flex-row justify-between">
              <h1 className="text-xl font-medium">{`${userShortName}'s Wish List`}</h1>
            </div>
            <div className="flex flex-col items-center divide-y">
              {gifts.map((gift) => {
                return (
                  <GiftRow
                    key={gift.id}
                    gift={gift}
                    view={viewGift}
                    hideStatus={false}
                  />
                );
              })}
              {gifts.length === 0 && (
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

import { useState } from "react";
import { useSession } from "next-auth/react";
import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";
import PlusIcon from "../../../public/delete.svg";
import CloseIcon from "../../../public/close.svg";
import CheckIcon from "../../../public/check.svg";
import ReleaseIcon from "../../../public/release.png";
import { giftRouter } from "../../server/trpc/router/gifts";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  closeView: () => void;
  deleteGift?: (giftId: string) => void;
  claimGift?: (giftId: string) => void;
  releaseGift?: (giftId: string) => void;
  loadingRelease?: boolean;
  loadingClaim?: boolean;
  purchasedFor?: {
    name: string;
    image: string;
  };
  suggestedBy?: {
    id: string;
    name: string;
    image: string;
  };
}

// TODO: date added timestamp

export default function Gift(props: Props) {
  const { data: sessionData } = useSession();
  const {
    gift,
    closeView,
    deleteGift,
    claimGift,
    releaseGift,
    loadingClaim,
    loadingRelease,
    purchasedFor,
    suggestedBy,
  } = props;
  return (
    <div>
      <div className="mb-8 flex flex-row items-center justify-between">
        <h1 className="text-xl font-medium">
          {purchasedFor ? `Your Gift for ${purchasedFor.name}` : "View Item"}
        </h1>
        <button
          onClick={closeView}
          className=" flex h-[35px] w-[35px] items-center justify-center rounded-md bg-[#bbb] hover:bg-[#999]"
        >
          <Image src={CloseIcon} width={18} height={18} alt="close" />
        </button>
      </div>

      <div className="flex flex-row gap-2 sm:gap-4">
        <div className="relative flex h-[125px] min-h-[125px] w-[125px] min-w-[125px]  items-center  justify-center overflow-hidden rounded-md border border-[#ddd] sm:h-[200px] sm:min-h-[200px] sm:w-[200px] sm:min-w-[200px]">
          {gift.image ? (
            <img
              src={gift.image}
              alt="gift-image"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image src={GiftIcon} width={50} height={50} alt="gift-image" />
          )}
        </div>
        <div className="text-md word relative flex w-full min-w-0  flex-col justify-between gap-2 sm:text-lg">
          <div className="flex flex-col gap-1 sm:gap-2">
            <div>
              {gift.link && gift.link !== "" ? (
                <a
                  className="mb-0 overflow-hidden text-ellipsis text-[#537393]  hover:underline"
                  href={gift.link || ""}
                  target="_blank"
                  rel="noreferrer"
                >
                  {gift.name}
                </a>
              ) : (
                <div className="mb-0 overflow-hidden text-ellipsis  break-all">
                  {gift.name}
                </div>
              )}

              <div className="mt-0 overflow-hidden text-ellipsis text-sm text-gray-400 sm:text-base">
                {gift.notes}
              </div>
            </div>
            {suggestedBy && suggestedBy.id !== sessionData?.user?.id && (
              <div className="w-max min-w-0 overflow-hidden rounded-sm border-gray-500 text-xs font-medium text-gray-500 sm:text-sm">{`Suggested by ${suggestedBy.name}`}</div>
            )}
            {suggestedBy && suggestedBy.id === sessionData?.user?.id && (
              <div className=" rounded-sm text-xs font-medium text-[#86A6C6] sm:text-sm">{`Suggested by You`}</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 justify-self-end text-xs sm:text-sm">
            {gift.userId !== sessionData?.user?.id && (
              <>
                {gift.claimedByUserId &&
                  gift.claimedByUserId !== sessionData?.user?.id && (
                    <div className="w-max-min flex  items-center gap-2 rounded-md bg-gray-400 py-1 px-3 text-white">
                      Claimed
                    </div>
                  )}
              </>
            )}
            {claimGift && gift.claimedByUserId === null && (
              <button
                onClick={() => claimGift(gift.id)}
                disabled={loadingClaim}
                className=" flex w-max items-center gap-2 rounded-md  bg-[#81C784] py-1  px-3 text-white hover:bg-[#66BB6A] "
              >
                <Image src={CheckIcon} width={18} height={18} alt="delete" />
                <div>Claim Item</div>
              </button>
            )}
            {releaseGift && gift.claimedByUserId === sessionData?.user?.id && (
              <button
                onClick={() => releaseGift(gift.id)}
                disabled={loadingRelease}
                className=" flex w-max items-center gap-2 rounded-md  bg-red-400 py-1  px-3 text-white hover:bg-red-500"
              >
                <Image src={ReleaseIcon} width={18} height={18} alt="delete" />
                <div>Release Gift</div>
              </button>
            )}
            {deleteGift && (
              <>
                <button
                  onClick={() => deleteGift(gift.id)}
                  className=" flex w-max grow-0 items-center gap-2 rounded-md bg-red-400 py-1 px-3  text-white hover:bg-red-500"
                >
                  <Image src={PlusIcon} width={18} height={18} alt="delete" />
                  {suggestedBy?.id === sessionData?.user?.id ? (
                    <div>Delete Suggestion</div>
                  ) : (
                    <div>Delete Item</div>
                  )}
                </button>
                <div className="text-end text-[10px] text-gray-400 sm:text-xs">
                  {
                    "If this gift is claimed, it stays in that user's gift list even after deletion."
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

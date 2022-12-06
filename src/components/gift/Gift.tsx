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
}

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
  } = props;
  return (
    <div>
      <div className="mb-8 flex flex-row justify-between">
        <h1 className="text-xl font-medium">View Gift</h1>
        <button
          onClick={closeView}
          className=" flex h-[35px] w-[35px] items-center justify-center rounded-md bg-[#bbb] hover:bg-[#999]"
        >
          <Image src={CloseIcon} width={18} height={18} alt="close" />
        </button>
      </div>

      <div className="flex flex-row gap-4">
        <div className="relative flex h-[200px] min-h-[200px] w-[200px] min-w-[200px] items-center justify-center overflow-hidden rounded-md border border-[#ddd]">
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
        <div className="relative grow">
          <div className="mb-2 text-lg">{gift.name}</div>
          <div className="text-md text-[#aaa]">{gift.notes}</div>
          <div className="justify-self-end">
            {deleteGift && (
              <button
                onClick={() => deleteGift(gift.id)}
                className="absolute bottom-0 right-0 flex items-center gap-2 rounded-md bg-red-500 py-1 px-3 text-white hover:bg-red-600"
              >
                <Image src={PlusIcon} width={20} height={20} alt="delete" />
                <div>Delete Gift</div>
              </button>
            )}
            {claimGift && gift.claimedByUserId === null && (
              <button
                onClick={() => claimGift(gift.id)}
                disabled={loadingClaim}
                className="absolute bottom-0 right-0 flex items-center gap-2 rounded-md  bg-[#81C784] py-1  px-3 text-white hover:bg-[#66BB6A]"
              >
                <Image src={CheckIcon} width={20} height={20} alt="delete" />
                <div>Claim Gift</div>
              </button>
            )}
            {releaseGift && gift.claimedByUserId === sessionData?.user?.id && (
              <button
                onClick={() => releaseGift(gift.id)}
                disabled={loadingRelease}
                className="absolute bottom-0 right-0 flex items-center gap-2 rounded-md  bg-red-400 py-1  px-3 text-white hover:bg-red-500"
              >
                <Image src={ReleaseIcon} width={20} height={20} alt="delete" />
                <div>Release Gift</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

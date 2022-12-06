import { RouterOutputs } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  view: (gift: RouterOutputs["gifts"]["create"]) => void;
  hideStatus: boolean;
}

export default function GiftRow(props: Props) {
  const { gift, view, hideStatus } = props;
  const { data: sessionData } = useSession();
  return (
    <div
      className={`relative flex w-full cursor-pointer gap-4  hover:bg-[#eee] ${
        !hideStatus &&
        gift.claimedByUserId &&
        gift.claimedByUserId !== sessionData?.user?.id &&
        "opacity-60"
      }`}
      onClick={() => view(gift)}
    >
      <div className="relative my-1 flex h-[75px] min-h-[75px] w-[75px] min-w-[75px] items-center justify-center overflow-hidden rounded-sm">
        {gift.image ? (
          <img
            src={gift.image}
            alt="gift"
            className=" h-full w-full object-cover"
          />
        ) : (
          <Image src={GiftIcon} width={24} height={24} alt="gift-image" />
        )}
      </div>
      <div className="grow-0">
        <div className=" max-h-6 overflow-hidden text-lg ">{gift.name}</div>
        <div className="text-md text-[#777]">{gift.notes}</div>
        {!hideStatus && (
          <>
            {gift.claimedByUserId &&
              gift.claimedByUserId !== sessionData?.user?.id && (
                <div className="absolute right-1 bottom-1 w-max self-end rounded-sm bg-gray-400 px-3 text-white">
                  Claimed
                </div>
              )}
            {gift.claimedByUserId &&
              gift.claimedByUserId === sessionData?.user?.id && (
                <div className="absolute right-1 bottom-1 w-max self-end rounded-sm  bg-[#9fbfdf] px-3 text-white">
                  Claimed By You
                </div>
              )}
            {!gift.claimedByUserId && (
              <div className="absolute right-1 bottom-1 w-max self-end rounded-sm  bg-[#81C784] px-3 text-white">
                Unclaimed
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { RouterOutputs } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";
import { string } from "zod";
import { GiftWithUser } from "../my-gifts/MyGifts";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  view: (gift: any) => void;
  hideStatus: boolean;
  purchasedFor?: {
    name: string;
    image: string;
  };
  suggestedBy?: {
    name: string;
    image: string;
  };
}

export default function GiftRow(props: Props) {
  const { gift, view, hideStatus, purchasedFor, suggestedBy } = props;
  const { data: sessionData } = useSession();
  return (
    <div
      className={`relative flex w-full cursor-pointer gap-2 hover:bg-[#eee]  sm:gap-4`}
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
      <div className="flex w-full grow-0 flex-col justify-between">
        <div>
          <div className=" text-md max-h-6 overflow-hidden sm:text-lg ">
            {gift.name}
          </div>
          <div className="text-sm text-[#777] sm:text-base">{gift.notes}</div>
        </div>
        <div className="flex w-full items-center justify-between pr-1 pb-1 text-gray-400">
          {suggestedBy && (
            <div className="text-xs">{`Suggested by ${suggestedBy.name}`}</div>
          )}
          {purchasedFor && (
            <div className="  flex flex-col items-end rounded-md bg-[#9fbfdf] py-[3px] px-2 text-white">
              <div className="flex gap-2">
                <div>
                  <Image
                    src={purchasedFor.image}
                    width={25}
                    height={25}
                    alt=""
                    className="rounded-full"
                  />
                </div>
                <div>{`For ${purchasedFor.name}`}</div>
              </div>
            </div>
          )}
          {!hideStatus && (
            <>
              {gift.claimedByUserId &&
                gift.claimedByUserId !== sessionData?.user?.id && (
                  <div className=" ml-auto w-max self-end rounded-sm bg-gray-400 px-3 py-[2px] text-sm text-white">
                    Claimed
                  </div>
                )}
              {gift.claimedByUserId &&
                gift.claimedByUserId === sessionData?.user?.id && (
                  <div className=" ml-auto w-max rounded-sm bg-[#9fbfdf] px-3 py-[2px] text-sm text-white">
                    Claimed By You
                  </div>
                )}
              {!gift.claimedByUserId && (
                <div className=" ml-auto w-max rounded-sm bg-[#81C784] px-3 py-[2px] text-sm text-white">
                  Unclaimed
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

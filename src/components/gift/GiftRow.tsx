import { RouterOutputs } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";
import StarIcon from "./StarIcon";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  view: (gift: any) => void;
  hideStatus: boolean;
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

export default function GiftRow(props: Props) {
  const { gift, view, hideStatus, purchasedFor, suggestedBy } = props;
  const { data: sessionData } = useSession();
  return (
    <div
      className={`relative flex w-full cursor-pointer items-center gap-2 hover:bg-[#eee] sm:gap-4`}
      onClick={() => view(gift)}
    >
      <div className="relative m-1 flex h-[75px] min-h-[75px] w-[75px] min-w-[75px] items-center justify-center overflow-hidden rounded-sm sm:h-[100px] sm:min-h-[100px] sm:w-[100px] sm:min-w-[100px]">
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
      <div className=" w-min-max flex h-full min-h-[83px] w-full min-w-0 flex-1 flex-col justify-between sm:min-h-[100px]">
        <div className="flex flex-col gap-[2px]">
          <div>
            <div className="flex gap-[6px]">
              <div className=" max-h-6 overflow-hidden text-ellipsis whitespace-nowrap text-sm sm:text-lg">
                {gift.name}
              </div>
              {gift.favorite && (
                <div className="ml-auto w-max self-end">
                  <StarIcon isFavorite isRowView />
                </div>
              )}
            </div>
            <div className=" overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500 sm:text-sm">
              {gift.notes}
            </div>
          </div>
          {suggestedBy && suggestedBy.id !== sessionData?.user?.id && (
            <div className="text-xs font-medium text-gray-500 sm:text-sm ">{`Suggested by ${suggestedBy.name}`}</div>
          )}
          {suggestedBy && suggestedBy.id === sessionData?.user?.id && (
            <div className="rounded-sm text-xs font-medium text-[#86A6C6] sm:text-sm">{`Suggested by You`}</div>
          )}
        </div>
        <div className="flex w-full flex-col items-end justify-between gap-[2px] pr-1 pb-1 sm:pb-0">
          {purchasedFor && (
            <div className=" ml-auto flex flex-col items-end rounded-md bg-[#9fbfdf] py-[3px] px-2 text-sm font-normal text-white sm:text-base">
              <div className="flex items-center gap-2">
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
                  <div className=" ml-auto w-max self-end whitespace-nowrap rounded-sm bg-gray-400 px-3 py-[2px] text-xs text-white sm:text-sm">
                    Claimed
                  </div>
                )}
              {gift.claimedByUserId &&
                gift.claimedByUserId === sessionData?.user?.id && (
                  <div className=" ml-auto w-max whitespace-nowrap rounded-sm bg-[#9fbfdf] px-3 py-[2px] text-xs text-white sm:text-sm">
                    Claimed By You
                  </div>
                )}
              {!gift.claimedByUserId && (
                <div className=" ml-auto w-max whitespace-nowrap rounded-sm bg-[#81C784] px-3 py-[2px] text-xs text-white sm:text-sm">
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

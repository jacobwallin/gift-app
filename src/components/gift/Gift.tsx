import { useState } from "react";
import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";
import PlusIcon from "../../../public/delete.svg";
import { giftRouter } from "../../server/trpc/router/gifts";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  closeView: () => void;
  deleteGift: (giftId: string) => void;
}

export default function Gift(props: Props) {
  const { gift, closeView, deleteGift } = props;
  console.log(gift);
  return (
    <div>
      <div className="mb-8 flex flex-row justify-between">
        <h1 className="text-xl font-medium">View Gift</h1>
        <button
          onClick={closeView}
          className=" h-[35px] w-[35px] rounded-md bg-[#ddd] hover:bg-[#bbb]"
        >
          x
        </button>
      </div>

      <div className="flex flex-row gap-4">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-md border border-[#ddd]">
          {gift.image ? (
            <Image
              src={gift.image}
              fill
              alt="gift-image"
              className="object-cover"
            />
          ) : (
            <Image src={GiftIcon} width={50} height={50} alt="gift-image" />
          )}
        </div>
        <div className="relative grow">
          <div className="mb-2 text-lg">{gift.name}</div>
          <div className="text-md text-[#aaa]">{gift.notes}</div>
          <div className="justify-self-end">
            <button
              onClick={() => deleteGift(gift.id)}
              className="absolute bottom-0 right-0 flex items-center gap-2 rounded-md bg-red-500 py-1 px-3 text-white hover:bg-red-600"
            >
              <Image src={PlusIcon} width={20} height={20} alt="delete" />
              <div>Delete Gift</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";
import PlusIcon from "../../../public/delete.svg";
import CloseIcon from "../../../public/close.svg";
import { giftRouter } from "../../server/trpc/router/gifts";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  closeView: () => void;
  deleteGift: (giftId: string) => void;
}

export default function Gift(props: Props) {
  const { gift, closeView, deleteGift } = props;
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

import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";
import GiftIcon from "../../../public/gift.png";

interface Props {
  gift: RouterOutputs["gifts"]["create"];
  view: (gift: RouterOutputs["gifts"]["create"]) => void;
}

export default function GiftRow(props: Props) {
  const { gift, view } = props;
  return (
    <div
      className=" flex cursor-pointer gap-4 hover:bg-[#eee]"
      onClick={() => view(gift)}
    >
      <div className="relative flex h-[75px] w-[75px] items-center justify-center overflow-hidden rounded-sm">
        {gift.image ? (
          <Image src={gift.image} fill alt="gift" className="object-cover" />
        ) : (
          <Image src={GiftIcon} width={24} height={24} alt="gift-image" />
        )}
      </div>
      <div>
        <div className="text-lg">{gift.name}</div>
        <div className="text-md text-[#777]">{gift.notes}</div>
      </div>
    </div>
  );
}

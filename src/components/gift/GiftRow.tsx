import { RouterOutputs } from "../../utils/trpc";
import Image from "next/image";

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
      <div className="h-[75px] w-[75px]">image</div>
      <div>
        <div className="text-lg">{gift.name}</div>
        <div className="text-md text-[#777]">{gift.notes}</div>
      </div>
    </div>
  );
}

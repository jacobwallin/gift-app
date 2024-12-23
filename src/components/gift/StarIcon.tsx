import clsx from "clsx";

export default function StarIcon({
  isFavorite,
  isRowView,
}: {
  isFavorite: boolean;
  isRowView?: boolean;
}) {
  return (
    <svg
      viewBox="4 3.5 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx({
        ["fill-white stroke-[#ccc] hover:stroke-[#aaa]"]: !isFavorite,
        ["fill-[#FFD700] stroke-[#FFD700]"]: isFavorite,
        ["hover:fill-[#ffe34d] hover:stroke-[#ffe34d]"]:
          isFavorite && !isRowView,
        ["h-7 w-7 pb-1"]: !isRowView,
        ["m-[2px] h-5 w-5 sm:m-0 sm:mr-[5px] sm:h-6 sm:w-6"]: isRowView,
      })}
    >
      <path
        d="M11.5245 4.46353C11.6741 4.00287 12.3259 4.00287 12.4755 4.46353L13.9084 8.87336C13.9753 9.07937 14.1673 9.21885 14.3839 9.21885H19.0207C19.505 9.21885 19.7064 9.83866 19.3146 10.1234L15.5633 12.8488C15.3881 12.9761 15.3148 13.2018 15.3817 13.4078L16.8145 17.8176C16.9642 18.2783 16.437 18.6613 16.0451 18.3766L12.2939 15.6512C12.1186 15.5239 11.8814 15.5239 11.7061 15.6512L7.95488 18.3766C7.56303 18.6613 7.03578 18.2783 7.18546 17.8176L8.6183 13.4078C8.68524 13.2018 8.61191 12.9761 8.43667 12.8488L4.68544 10.1234C4.29358 9.83866 4.49497 9.21885 4.97933 9.21885H9.6161C9.83272 9.21885 10.0247 9.07937 10.0916 8.87336L11.5245 4.46353Z"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

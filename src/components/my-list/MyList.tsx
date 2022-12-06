import { useState, useEffect } from "react";
import GiftRow from "../gift/GiftRow";
import Gift from "../gift/Gift";
import GiftForm from "../gift-form/GiftForm";
import { FormValues } from "../gift-form/GiftForm";
import { trpc } from "../../utils/trpc";
import { RouterOutputs } from "../../utils/trpc";
import PlusIcon from "../../../public/plus-icon.svg";
import Image from "next/image";

const initialValues = {
  link: "",
  name: "",
  notes: "",
  image: "",
  imageUrl: "",
};

export default function MyList() {
  const [showForm, setShowForm] = useState(false);
  const giftsQuery = trpc.gifts.getAll.useQuery();
  const mutation = trpc.gifts.create.useMutation();
  const deleteMutation = trpc.gifts.delete.useMutation();

  const [initialFormValues, setInitialFormValues] =
    useState<FormValues>(initialValues);
  const [gifts, setGifts] = useState<RouterOutputs["gifts"]["getAll"]>([]);
  const [selectedGift, setSelectedGift] = useState<
    RouterOutputs["gifts"]["create"] | undefined
  >(undefined);

  useEffect(() => {
    if (mutation.status === "success") {
      toggleForm();
      // add new gift to list
      setGifts([mutation.data, ...gifts]);
    }
  }, [mutation.status]);
  useEffect(() => {
    if (deleteMutation.status === "success") {
      // add new gift to list
      setGifts(gifts.filter((g) => g.id !== selectedGift?.id));
      setSelectedGift(undefined);
    }
  }, [deleteMutation.status]);

  useEffect(() => {
    setGifts(giftsQuery.data || []);
  }, [giftsQuery.data]);

  function toggleForm() {
    setShowForm(!showForm);
    if (showForm) {
      setInitialFormValues(initialValues);
    }
  }
  function viewGift(gift: RouterOutputs["gifts"]["create"]) {
    setSelectedGift(gift);
  }
  function closeGiftView() {
    setSelectedGift(undefined);
  }
  function addGift(values: FormValues) {
    mutation.mutate(values);
  }
  function deleteGift(giftId: string) {
    deleteMutation.mutate({ giftId });
  }

  return (
    <>
      {showForm && (
        <GiftForm
          close={toggleForm}
          submit={addGift}
          loading={mutation.isLoading}
          initialValues={initialFormValues}
          setInitialValues={setInitialFormValues}
        />
      )}
      {!showForm && (
        <>
          {giftsQuery.isLoading ? (
            <div>loading...</div>
          ) : selectedGift !== undefined ? (
            <Gift
              gift={selectedGift}
              deleteGift={deleteGift}
              closeView={closeGiftView}
            />
          ) : (
            <>
              <div className="mb-8 flex flex-row justify-between">
                <h1 className="text-xl font-medium">My Wish List</h1>
                <button
                  onClick={toggleForm}
                  className="active:before: flex h-[35px] w-[35px] items-center justify-center rounded-md bg-[#81C784] text-white hover:bg-[#66BB6A]"
                >
                  <Image src={PlusIcon} width={17} height={17} alt="add gift" />
                </button>
              </div>
              <div className="flex flex-col items-center divide-y">
                {gifts.map((gift) => {
                  return (
                    <GiftRow
                      key={gift.id}
                      gift={gift}
                      view={viewGift}
                      hideStatus
                    />
                  );
                })}
                {gifts.length === 0 && (
                  <div className="text-[#999]">
                    {"You haven't added any gifts yet"}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

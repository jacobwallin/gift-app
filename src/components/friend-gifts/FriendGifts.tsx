import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import GiftRow from "../gift/GiftRow";
import Gift from "../gift/Gift";
import GiftForm from "../gift-form/GiftForm";
import { FormValues } from "../gift-form/GiftForm";
import { trpc } from "../../utils/trpc";
import { RouterOutputs } from "../../utils/trpc";
import PlusIcon from "../../../public/plus-icon.svg";
import Image from "next/image";

export type SuggestedGift = RouterOutputs["gifts"]["getAllByUser"][number];

interface Props {
  userId: string;
  userShortName: string;
}
//TODO: claiming suggested gift
//TODO: delete suggested gift
//TODO:
const initialValues = {
  link: "",
  name: "",
  notes: "",
  image: "",
  imageUrl: "",
};

export default function FriendGifts(props: Props) {
  const { userId, userShortName } = props;
  const { data: sessionData } = useSession();
  const giftsQuery = trpc.gifts.getAllByUser.useQuery({ userId: userId });
  const claimGiftMutation = trpc.gifts.claim.useMutation();
  const releaseGiftMutation = trpc.gifts.release.useMutation();
  const addSuggestionMutation = trpc.gifts.suggest.useMutation();
  const deleteSuggestionMutation = trpc.gifts.deleteSuggestion.useMutation();

  const [initialFormValues, setInitialFormValues] =
    useState<FormValues>(initialValues);
  const [gifts, setGifts] = useState<RouterOutputs["gifts"]["getAllByUser"]>(
    []
  );
  const [suggestedGifts, setSuggestedGifts] = useState<
    RouterOutputs["gifts"]["getAllByUser"]
  >([]);
  const [selectedGift, setSelectedGift] = useState<
    RouterOutputs["gifts"]["create"] | undefined
  >(undefined);
  const [selectedSuggestion, setSelectedSuggestion] = useState<
    SuggestedGift | undefined
  >(undefined);
  const [claimedGiftId, setClaimedGiftId] = useState("");
  const [releasedGiftId, setReleasedGiftId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuggestedGifts, setShowSuggestedGifts] = useState(false);

  useEffect(() => {
    setGifts(
      giftsQuery.data
        ? giftsQuery.data.filter((g) => g.suggestedByUserId === null)
        : []
    );
    setSuggestedGifts(
      giftsQuery.data
        ? giftsQuery.data.filter((g) => g.suggestedByUserId !== null)
        : []
    );
  }, [giftsQuery.data]);

  useEffect(() => {
    setSelectedGift(undefined);
  }, [userId]);

  function viewGift(gift: RouterOutputs["gifts"]["create"]) {
    setSelectedGift(gift);
  }
  function viewSuggestion(gift: SuggestedGift) {
    setSelectedSuggestion(gift);
  }
  function closeGiftView() {
    setSelectedGift(undefined);
    setSelectedSuggestion(undefined);
  }
  function claimGift(giftId: string) {
    setClaimedGiftId(giftId);
    claimGiftMutation.mutate({ giftId: giftId });
  }
  function releaseGift(giftId: string) {
    setReleasedGiftId(giftId);
    releaseGiftMutation.mutate({ giftId: giftId });
  }
  function toggleForm() {
    setShowForm(!showForm);
    if (showForm) {
      setInitialFormValues(initialValues);
    }
  }
  function addSuggestion(values: FormValues) {
    addSuggestionMutation.mutate({
      ...values,
      userId: userId,
    });
  }
  function deleteSuggestion(giftId: string) {
    deleteSuggestionMutation.mutate({ giftId });
  }

  useEffect(() => {
    if (addSuggestionMutation.status === "success") {
      toggleForm();
      setSuggestedGifts([
        {
          ...addSuggestionMutation.data,
          suggestedBy: {
            name: sessionData?.user?.name || "",
            id: sessionData?.user?.id || "",
            email: sessionData?.user?.email || "",
            image: sessionData?.user?.image || "",
            emailVerified: null,
          },
        },
        ...suggestedGifts,
      ]);
    }
  }, [addSuggestionMutation.status]);

  useEffect(() => {
    if (claimGiftMutation.status === "success") {
      if (claimGiftMutation.data.count > 0) {
        setGifts(
          gifts.map((gift) => {
            if (gift.id === claimedGiftId) {
              return {
                ...gift,
                claimedByUserId: sessionData?.user?.id || null,
              };
            }
            return gift;
          })
        );
        if (selectedGift) {
          setSelectedGift({
            ...selectedGift,
            claimedByUserId: sessionData?.user?.id || null,
          });
        }
        if (selectedSuggestion) {
          setSelectedSuggestion({
            ...selectedSuggestion,
            claimedByUserId: sessionData?.user?.id || null,
          });
        }
      }
    }
  }, [claimGiftMutation.status, claimedGiftId]);

  useEffect(() => {
    if (releaseGiftMutation.status === "success") {
      if (releaseGiftMutation.data.count > 0) {
        setGifts(
          gifts.map((gift) => {
            if (gift.id === releasedGiftId) {
              return {
                ...gift,
                claimedByUserId: null,
              };
            }
            return gift;
          })
        );
        if (selectedGift) {
          setSelectedGift({
            ...selectedGift,
            claimedByUserId: null,
          });
        }
        if (selectedSuggestion) {
          setSelectedSuggestion({
            ...selectedSuggestion,
            claimedByUserId: null,
          });
        }
      }
    }
  }, [releaseGiftMutation.status, releasedGiftId]);

  useEffect(() => {
    if (deleteSuggestionMutation.status === "success") {
      if (deleteSuggestionMutation.data.count > 0) {
        setSuggestedGifts(
          suggestedGifts.filter((g) => g.id !== selectedSuggestion?.id)
        );
      }
      setSelectedSuggestion(undefined);
    }
  }, [deleteSuggestionMutation.status]);

  return (
    <>
      {showForm && (
        <GiftForm
          close={toggleForm}
          submit={addSuggestion}
          loading={addSuggestionMutation.isLoading}
          initialValues={initialFormValues}
          setInitialValues={setInitialFormValues}
          title={`Suggest A Gift For ${userShortName}`}
        />
      )}
      {!showForm && (
        <>
          {giftsQuery.isLoading ? (
            <div>loading...</div>
          ) : (
            <>
              {selectedGift !== undefined && (
                <Gift
                  gift={selectedGift}
                  closeView={closeGiftView}
                  claimGift={claimGift}
                  releaseGift={releaseGift}
                  loadingClaim={claimGiftMutation.isLoading}
                  loadingRelease={releaseGiftMutation.isLoading}
                />
              )}
              {selectedSuggestion !== undefined && (
                <Gift
                  gift={{
                    ...selectedSuggestion,
                  }}
                  closeView={closeGiftView}
                  claimGift={claimGift}
                  releaseGift={releaseGift}
                  loadingClaim={claimGiftMutation.isLoading}
                  loadingRelease={releaseGiftMutation.isLoading}
                  deleteGift={
                    selectedSuggestion.suggestedBy?.id === sessionData?.user?.id
                      ? deleteSuggestion
                      : undefined
                  }
                  suggestedBy={{
                    id: selectedSuggestion.suggestedBy?.id || "",
                    name:
                      selectedSuggestion.suggestedBy?.name?.split(" ")[0] || "",
                    image: selectedSuggestion.suggestedBy?.image || "",
                  }}
                />
              )}

              {!selectedGift && !selectedSuggestion && (
                <>
                  <div className="mb-8 flex flex-row justify-between">
                    <div className="flex gap-2">
                      <h1
                        className={`box-border flex cursor-pointer items-center border-b-4 px-1 text-sm font-medium sm:text-lg  ${
                          !showSuggestedGifts
                            ? " border-[#86A6C6] text-black"
                            : "border-white text-gray-400 hover:text-gray-500"
                        }`}
                        onClick={() => setShowSuggestedGifts(false)}
                      >{`${userShortName}'s List`}</h1>
                      <h1
                        className={`box-border flex cursor-pointer items-center border-b-4 px-1 text-sm font-medium  sm:text-lg ${
                          showSuggestedGifts
                            ? " border-[#86A6C6] text-black"
                            : "border-white text-gray-400 hover:text-gray-500"
                        }`}
                        onClick={() => setShowSuggestedGifts(true)}
                      >
                        Suggestions
                      </h1>
                    </div>
                    <button
                      onClick={toggleForm}
                      className="active:before: flex h-[35px] w-[35px] items-center justify-center rounded-md bg-[#81C784] text-white hover:bg-[#66BB6A]"
                    >
                      <Image
                        src={PlusIcon}
                        width={17}
                        height={17}
                        alt="add gift"
                      />
                    </button>
                  </div>
                  <div className="flex flex-col items-center divide-y">
                    {showSuggestedGifts ? (
                      <>
                        {suggestedGifts.map((gift) => {
                          return (
                            <GiftRow
                              key={gift.id}
                              gift={gift}
                              view={viewSuggestion}
                              hideStatus={false}
                              suggestedBy={{
                                name:
                                  gift.suggestedBy?.name?.split(" ")[0] || "",
                                image: gift.suggestedBy?.image || "",
                                id: gift.suggestedBy?.id || "",
                              }}
                            />
                          );
                        })}
                        {suggestedGifts.length === 0 && (
                          <div className="text-[#999]">
                            {`No suggestions have been added for ${userShortName}`}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {gifts.map((gift) => {
                          return (
                            <GiftRow
                              key={gift.id}
                              gift={gift}
                              view={viewGift}
                              hideStatus={false}
                            />
                          );
                        })}
                        {gifts.length === 0 && (
                          <div className="text-[#999]">
                            {`${userShortName} hasn't added any gifts yet`}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

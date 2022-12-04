import { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import Gift from "./Gift";
import GiftForm from "../gift-form/GiftForm";
import { FormValues } from "../gift-form/GiftForm";

export default function Main() {
  const { data: sessionData } = useSession();
  const mutation = trpc.gifts.create.useMutation();

  const [selectedUserId, setSelectedUserId] = useState(
    sessionData?.user?.id ?? ""
  );
  const [showForm, setShowForm] = useState(true);

  function toggleForm() {
    setShowForm(!showForm);
  }

  function addGift(values: FormValues) {
    console.log("hehehs");
    mutation.mutate(values);
  }

  return (
    <div className="mt-20 flex justify-center gap-5">
      <div className=" flex min-h-[400px] w-[200px] flex-col rounded-lg bg-white p-4 shadow-md">
        <div className="text-xl">My List</div>
        <div>Family Lists</div>
      </div>
      <div className="flex h-[50px] w-[700px] flex-col gap-4">
        {showForm && (
          <GiftForm
            close={toggleForm}
            submit={addGift}
            loading={mutation.isLoading}
          />
        )}
        {!showForm && (
          <>
            <div className="border-1 border-gray flex h-[50px] w-full flex-col rounded-lg bg-white shadow-md">
              <button onClick={toggleForm}>Add gift</button>
            </div>
            <div className="border-1 border-gray flex w-full flex-col rounded-lg bg-white shadow-md">
              <Gift />
              <Gift />
              <Gift />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

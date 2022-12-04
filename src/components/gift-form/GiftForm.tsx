import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextInput } from "./FormComponents";

export interface FormValues {
  link: string;
  name: string;
  notes: string;
  image: string;
}

interface Props {
  close: () => void;
  submit: (values: FormValues) => void;
  loading: boolean;
}

export default function GiftForm(props: Props) {
  const { close, submit, loading } = props;
  const initialValues: FormValues = {
    link: "",
    name: "",
    notes: "",
    image: "",
  };
  return (
    <div className="h-[700px] w-full rounded-lg bg-white p-4 shadow-md">
      <div className="mb-6 flex justify-between">
        <h1 className="text-lg font-medium">Add To Your Wish List</h1>
        <button
          onClick={close}
          className=" h-[30px] w-[30px] rounded-md bg-[#ddd] hover:bg-[#bbb]"
        >
          x
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          link: Yup.string().url(),
          itemName: Yup.string().required("Required"),
          notes: Yup.string(),
        })}
        onSubmit={(values) => alert("hi")}
      >
        <Form className="flex flex-col">
          <TextInput
            label="Link"
            name="link"
            id="link"
            type="text"
            placeholder=""
          />
          <TextInput
            label="Item Name"
            name="name"
            id="name"
            type="text"
            placeholder=""
          />
          <TextInput
            label="Notes"
            name="notes"
            id="notes"
            type="text"
            placeholder=""
            note="(item sizing, or other details)"
          />
          <button
            type="submit"
            disabled={loading}
            className="active:before: h-[32px] w-[100px] rounded-md bg-[#81C784] text-white hover:bg-[#66BB6A]"
          >
            Add Item
          </button>
        </Form>
      </Formik>
    </div>
  );
}

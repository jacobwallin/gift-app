import { useState, useEffect, useRef } from "react";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import CloseIcon from "../../../public/close.svg";
import UploadIcon from "../../../public/upload-white.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextInput, UrlInput } from "./FormComponents";

export interface FormValues {
  link: string;
  name: string;
  notes: string;
  image: string;
  imageUrl: string;
}

interface Props {
  close: () => void;
  submit: (values: FormValues) => void;
  loading: boolean;
  initialValues: FormValues;
  setInitialValues: (values: FormValues) => void;
}

export default function GiftForm(props: Props) {
  const { close, submit, loading, initialValues, setInitialValues } = props;
  const { imageUrl } = initialValues;

  const getMetadata = trpc.gifts.getMetadata.useMutation();

  const pictureRef = useRef<HTMLInputElement>(null);
  const formRef = useRef(null);

  const [image, setImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageError, setImageError] = useState("");
  const [metaData, setMetaData] = useState(undefined);

  const handleOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    const reader = new FileReader();

    const fileName = file?.name?.split(".")?.[0] ?? "New file";

    reader.addEventListener(
      "load",
      async function () {
        try {
          if (typeof reader.result === "string") {
            setImage(reader.result);
            setImageAlt(fileName);
          }
        } catch (err) {
          setImageError("Unable to update image");
        } finally {
          // setUpdatingPicture(false);
        }
      },
      false
    );

    if (file) {
      // 10mb size limit
      if (file.size <= 10 * 1024 * 1024) {
        // setUpdatingPicture(true);
        setImageError("");
        reader.readAsDataURL(file);
      } else {
        setImageError("File size exceeds 10MB.");
      }
    }
  };

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      pictureRef.current.click();
    }
  };

  function fetchMetadata(url: string) {
    getMetadata.mutate({ url });
  }

  useEffect(() => {
    if (getMetadata.status === "success") {
      const name = getMetadata.data.title || "";
      const link = getMetadata.data.url || "";
      const imageUrl = getMetadata.data.image || "";
      // remove user's image if it exists
      setImage(null);
      setInitialValues({
        ...initialValues,
        name,
        link,
        imageUrl,
      });
    }
  }, [getMetadata.status]);

  function submitForm(values: FormValues) {
    if (image && typeof image === "string") {
      submit({ ...values, image: image });
    } else {
      submit(values);
    }
  }

  return (
    <>
      <div className="mb-6 flex justify-between">
        <h1 className="text-xl font-medium">Add To Your Wish List</h1>
        <button
          onClick={close}
          className=" flex h-[35px] w-[35px] items-center justify-center rounded-md bg-[#bbb] hover:bg-[#999]"
        >
          <Image src={CloseIcon} width={18} height={18} alt="close" />
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          link: Yup.string().url(),
          name: Yup.string().max(100).required("Required"),
          notes: Yup.string().max(100),
          image: Yup.string(),
        })}
        onSubmit={(values) => submitForm(values)}
        innerRef={formRef}
        enableReinitialize
      >
        <Form className="flex flex-col">
          <UrlInput
            label="Link"
            name="link"
            id="link"
            type="text"
            placeholder=""
            fetchMetadata={fetchMetadata}
            disabled={getMetadata.isLoading || loading}
            autofillError={getMetadata.isError}
          />
          <TextInput
            label="Item Name"
            name="name"
            id="name"
            type="text"
            placeholder=""
            disabled={getMetadata.isLoading || loading}
          />
          <TextInput
            label="Notes"
            name="notes"
            id="notes"
            type="text"
            placeholder=""
            note="(item sizing, or other details)"
            disabled={getMetadata.isLoading || loading}
          />
          <label className="text-md mb-1 text-[#444]">Image</label>
          <div
            // disabled={updatingPicture}
            onClick={handleOnClickPicture}
            className={` aspect-w-16 aspect-h-9 group relative flex h-[250px] w-[250px] cursor-pointer flex-col justify-center overflow-hidden rounded-md transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
          ${
            image || imageUrl !== ""
              ? "hover:opacity-50 disabled:hover:opacity-100"
              : "border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200"
          }`}
          >
            {image ? (
              <Image
                src={image}
                alt={imageAlt ?? ""}
                layout="fill"
                objectFit={"cover"}
              />
            ) : null}
            {imageUrl !== "" && !image ? (
              <img src={imageUrl} alt={imageAlt ?? ""} />
            ) : null}

            <div className="flex items-center justify-center">
              {!image && imageUrl === "" ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="shrink-0 rounded-full bg-[#bbb] p-2 transition group-hover:scale-110 group-focus:scale-110">
                    <Image
                      src={UploadIcon}
                      width={24}
                      height={24}
                      alt="upload image"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 transition">
                    Add Image
                  </span>
                </div>
              ) : null}
              <input
                ref={pictureRef}
                type="file"
                accept={".png, .jpg, .jpeg"}
                onChange={handleOnChangePicture}
                className="hidden"
                disabled={getMetadata.isLoading || loading}
              />
            </div>
          </div>
          {imageError !== "" && (
            <div className="ml-1 text-sm text-[#E57373]">{`*${imageError}`}</div>
          )}
          <button
            type="submit"
            disabled={getMetadata.isLoading || loading}
            className="active:before: mt-3 h-[32px] w-[100px] rounded-md bg-[#81C784] text-white hover:bg-[#66BB6A]"
          >
            Add Item
          </button>
        </Form>
      </Formik>
    </>
  );
}

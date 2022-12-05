import React, { useEffect } from "react";
import Image from "next/image";
import { useField, FieldHookConfig } from "formik";
import PencilIcon from "../../../public/pencil-3.png";

interface LabelCustomProps {
  label: string;
  note?: string;
}

export const TextInput: React.FC<
  FieldHookConfig<string> & LabelCustomProps
> = ({ label, note, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <div className="mb-6 flex flex-col">
      <label
        htmlFor={props.id || props.name}
        className="text-md mb-1 text-[#444]"
      >
        {label}
      </label>
      <input
        autoComplete="off"
        className="h-[35px] w-[300px] rounded-sm  border border-[#444] p-2 text-sm"
        {...field}
      />
      {note && <div className="mt-1 text-xs text-[#999]">{note}</div>}
      {meta.touched && meta.error ? (
        <div className="ml-1 text-sm text-[#E57373]">{`*${meta.error}`}</div>
      ) : null}
    </div>
  );
};

interface UrlInputCustomProps {
  label: string;
  note?: string;
  fetchMetadata: (url: string) => void;
}

export const UrlInput: React.FC<
  FieldHookConfig<string> & UrlInputCustomProps
> = ({ label, note, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);

  return (
    <div className="mb-6 flex flex-col">
      <div className="flex w-[300px] items-end justify-between">
        <label
          htmlFor={props.id || props.name}
          className="text-md mb-1 text-[#444]"
        >
          {label}
        </label>
        <div
          className="itens-center mb-1 flex cursor-pointer justify-center gap-1 rounded-md bg-gray-400 py-1 px-3 text-sm text-white hover:bg-gray-500"
          onClick={() => props.fetchMetadata(field.value)}
        >
          <div className="relative h-[18px] w-[18px]">
            <Image src={PencilIcon} fill alt="autofill" />
          </div>
          <span>Auto-Fill</span>
        </div>
      </div>
      <input
        autoComplete="off"
        className="h-[35px] w-[300px] rounded-sm border border-[#444] p-2 text-sm"
        {...field}
      />
      {note && <div className="mt-1 text-xs text-[#999]">{note}</div>}
      {meta.touched && meta.error ? (
        <div className="ml-1 text-sm text-[#E57373]">{`*${meta.error}`}</div>
      ) : null}
    </div>
  );
};

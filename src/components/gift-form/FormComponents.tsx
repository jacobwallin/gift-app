import React, { useEffect } from "react";
import Image from "next/image";
import { useField, FieldHookConfig } from "formik";
import PencilIcon from "../../../public/pencil-3.png";

interface LabelCustomProps {
  label: string;
  note?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<
  FieldHookConfig<string> & LabelCustomProps
> = ({ label, note, disabled, ...props }) => {
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
        className="h-[35px] w-[300px] rounded-sm  border border-[#444] p-2 text-sm disabled:border-[#999] disabled:text-[#999]"
        {...field}
        disabled={disabled}
      />
      {note && <div className="mt-1 text-xs text-[#999]">{note}</div>}
      {meta.touched && meta.error ? (
        <div className="ml-1 text-sm text-[#E57373]">{`*${meta.error}`}</div>
      ) : null}
    </div>
  );
};

interface UrlInputCustomProps extends LabelCustomProps {
  fetchMetadata: (url: string) => void;
}

export const UrlInput: React.FC<
  FieldHookConfig<string> & UrlInputCustomProps
> = ({ label, note, disabled, ...props }) => {
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
        <button
          className="itens-center mb-1 flex cursor-pointer justify-center gap-1 rounded-md bg-[#bbb] py-1 px-3 text-sm text-white enabled:hover:bg-[#999] disabled:cursor-default"
          onClick={() => props.fetchMetadata(field.value)}
          type="button"
          disabled={meta.error !== undefined || meta.value === ""}
        >
          <div className="relative h-[18px] w-[18px]">
            <Image src={PencilIcon} fill alt="autofill" />
          </div>
          <span>Auto-Fill</span>
        </button>
      </div>
      <input
        autoComplete="off"
        className="h-[35px] w-[300px] rounded-sm border border-[#444] p-2 text-sm disabled:border-[#999] disabled:text-[#999]"
        {...field}
        disabled={disabled}
      />
      {note && <div className="mt-1 text-xs text-[#999]">{note}</div>}
      {meta.touched && meta.error ? (
        <div className="ml-1 text-sm text-[#E57373]">{`*${meta.error}`}</div>
      ) : null}
    </div>
  );
};

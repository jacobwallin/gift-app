import React from "react";
import { useField, FieldHookConfig } from "formik";

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
        className="h-[35px] w-[300px] rounded-sm  border border-[#444] p-2"
        {...field}
      />
      {note && <div className="mt-1 text-xs text-[#999]">{note}</div>}
      {meta.touched && meta.error ? (
        <div className="ml-1 text-sm text-[#E57373]">{`*${meta.error}`}</div>
      ) : null}
    </div>
  );
};

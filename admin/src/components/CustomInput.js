import React from "react";

const CustomInput = (props) => {
  const {
    name,
    onChange,
    onBlur,
    type,
    label,
    value,
    defaultValue,
    i_class,
  } = props;

  const inputProps = {
    type,
    className: `form-control ${i_class || ""}`,
    id: name,
    name,
    onBlur,
    ...(typeof onChange === "function" && { onChange }),
    ...(value !== undefined ? { value } : { defaultValue }),
  };

  return (
    <div className="form-floating mt-3">
      <input {...inputProps} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

export default CustomInput;

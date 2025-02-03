// Input.jsx
import React from "react";

const FormError = ({
  error
}) => {
  
  return (
    <>
      {error && <div className="text-red text-[12px] min-h-[1rem] leading-[1rem]">{error?.message || ''}</div>}
    </>
  );
};

export default FormError;

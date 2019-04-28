import React from "react";
import { Field } from "formik";

const FormikInput = ({
  name,
  label,
  formikProps,
  formikKey,
  areaClass,
  ...rest
}) => {
  return (
    <React.Fragment>
      <div className={areaClass}>
        <Field type={formikKey} name={name} {...rest} />
      </div>
      {formikProps.touched[name] ? (
        formikProps.errors[name] ? (
          <p style={{ color: "red" }}>{formikProps.errors[name]}</p>
        ) : (
          <p>&nbsp;</p>
        )
      ) : (
        <p>&nbsp;</p>
      )}
    </React.Fragment>
  );
};

export default FormikInput;

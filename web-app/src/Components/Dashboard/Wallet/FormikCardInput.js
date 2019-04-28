import React from "react";
import { Field } from "formik";

import styles from "./Wallet.module.css";

const FormikCardInput = ({
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
      <div
        style={{ color: "red" }}
        className={styles["wallet-add-card-input-error"]}
      >
        {(formikProps.touched[name] ? (
          formikProps.errors[name]
        ) : (
          <p className={styles["wallet-add-card-input-error"]}>&nbsp;</p>
        )) || <p className={styles["wallet-add-card-input-error"]}>&nbsp;</p>}
      </div>
    </React.Fragment>
  );
};

export default FormikCardInput;

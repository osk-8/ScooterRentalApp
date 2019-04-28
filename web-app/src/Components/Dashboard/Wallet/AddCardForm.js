import React from "react";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

import FormikCardInput from "./FormikCardInput";
import styles from "./Wallet.module.css";

class LoginForm extends React.Component {
  render() {
    return (
      <div>
        <Formik
          initialValues={{
            creditCardNumber: "",
            expirationDate: "",
            expirationMonth: "",
            expirationYear: "",
            cscNumber: ""
          }}
          onSubmit={(values, actions) => {
            axios({
              method: "post",
              url: "http://pascal.fis.agh.edu.pl:1777/addCreditCard",
              data: {
                creditCardNumber: values.creditCardNumber,
                expirationDate:
                  "20" +
                  values.expirationYear +
                  "-" +
                  values.expirationMonth +
                  "-01",
                cscNumber: values.cscNumber
              },
              headers: {
                "x-access-token": localStorage.getItem("userToken")
              }
            })
              .then(response => {
                return this.props.handleCardAdding();
              })
              .catch(error => {
                actions.setFieldError("general", error.response.data.message);
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
          validationSchema={yup.object().shape({
            creditCardNumber: yup
              .string()
              .label("Credit card number")
              .required(),
            expirationMonth: yup
              .string("")
              .label("")
              .matches(/[0][0-9]|[1][0-2]/, { message: "Invalid" })
              .required("Invalid"),
            expirationYear: yup
              .string("Invalid")
              .label("")
              .matches(/[0-9][0-9]/, { message: "Invalid" })
              .required("Invalid"),
            cscNumber: yup
              .string("Invalid")
              .label("")
              .matches(/[0-9][0-9][0-9]/, { message: "Invalid" })
              .required("Invalid")
          })}
        >
          {formikProps => (
            <React.Fragment>
              <div className={styles["wallet-add-card-form-border"]}>
                <div>
                  <label className={styles["wallet-add-card-label"]}>
                    CREDIT CARD NUMBER
                  </label>
                  <FormikCardInput
                    name="creditCardNumber"
                    label="Credit card number"
                    formikProps={formikProps}
                    formikKey="text"
                    className={styles["wallet-add-card-input"]}
                    areaClass={styles["wallet-add-card-input-area-number"]}
                    autoFocus
                  />
                </div>
                <div className={styles["wallet-add-card-row-second"]}>
                  <div
                    className={styles["wallet-add-card-row-second-expiration"]}
                  >
                    <label className={styles["wallet-add-card-label"]}>
                      EXPIRATION DATE
                    </label>
                    <div
                      className={
                        styles["wallet-add-card-row-second-expiration-input"]
                      }
                    >
                      <div
                        className={styles["wallet-add-card-expiration-input"]}
                      >
                        <FormikCardInput
                          name="expirationMonth"
                          label="Expiration month"
                          formikProps={formikProps}
                          formikKey="text"
                          placeholder="MM"
                          className={styles["wallet-add-card-input"]}
                          areaClass={
                            styles["wallet-add-card-input-area-expiration"]
                          }
                        />
                      </div>
                      <h1>/</h1>
                      <div
                        className={styles["wallet-add-card-expiration-input"]}
                      >
                        <FormikCardInput
                          name="expirationYear"
                          label="Expiration year"
                          formikProps={formikProps}
                          formikKey="text"
                          placeholder="YY"
                          className={styles["wallet-add-card-input"]}
                          areaClass={
                            styles["wallet-add-card-input-area-expiration"]
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles["wallet-add-card-row-second-csc"]}>
                    <label className={styles["wallet-add-card-label"]}>
                      CSC
                    </label>
                    <FormikCardInput
                      name="cscNumber"
                      label="Csc number"
                      formikProps={formikProps}
                      formikKey="text"
                      placeholder="XXX"
                      className={styles["wallet-add-card-input"]}
                      areaClass={styles["wallet-add-card-input-area-csc"]}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className={styles["wallet-add-card-button"]}
                onClick={formikProps.handleSubmit}
              >
                Add card
              </button>
              <p style={{ color: "red" }}>{formikProps.errors.general}</p>
            </React.Fragment>
          )}
        </Formik>
      </div>
    );
  }
}

export default LoginForm;

import React from "react";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

import FormikInput from "../../Form/FormikInput";
import styles from "./Wallet.module.css";

class PrepaidForm extends React.Component {
  render() {
    return (
      <div>
        <Formik
          initialValues={{
            amount: "",
            result: ""
          }}
          onSubmit={(values, actions) => {
            axios({
              method: "post",
              url: "http://pascal.fis.agh.edu.pl:1777/prePaid",
              data: {
                amount: values.amount
              },
              headers: {
                "x-access-token": localStorage.getItem("userToken")
              }
            })
              .then(response => {
                values.result = response.data.message;
                return this.props.handlePrepaid(values.amount);
              })
              .catch(error => {
                values.result = "";
		actions.setFieldError("general", error.response.data.message);
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
          validationSchema={yup.object().shape({
            amount: yup.string().required("Please enter a value")
          })}
        >
          {formikProps => (
            <React.Fragment>
              <FormikInput
                name="amount"
                label="Prepaid amount"
                formikProps={formikProps}
                formikKey="text"
                placeholder="Amount"
                className={styles["wallet-prepaid-input"]}
                areaClass={styles["wallet-prepaid-input-area"]}
                autoFocus
              />
              <button
                type="submit"
                className={styles["wallet-prepaid-button"]}
                onClick={formikProps.handleSubmit}
              >
                Transfer
              </button>
              {formikProps.errors.general ? (
                <p style={{ color: "red" }}>{formikProps.errors.general}</p>
              ) : formikProps.values.result ? (
                <p style={{ color: "green" }}>{formikProps.values.result}</p>
              ) : (
                <p>&nbsp;</p>
              )}
            </React.Fragment>
          )}
        </Formik>
      </div>
    );
  }
}

export default PrepaidForm;

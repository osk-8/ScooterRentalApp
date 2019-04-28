import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";

import FormikInput from "../Form/FormikInput";
import styles from "../Registration/Registration.module.css";

class RegistrationForm extends React.Component {
  state = {
    fireRedirect: false
  };

  render() {
    return (
      <div>
        <Formik
          initialValues={{ name: "", surname: "", email: "", password: "" }}
          onSubmit={(values, actions) => {
            axios
              .post(`http://pascal.fis.agh.edu.pl:1777/registerUser`, {
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password
              })
              .then(response => {
                if (response.data) {
                  localStorage.setItem("userToken", response.data.token);
                  this.setState({ fireRedirect: true });
                }
              })
              .catch(error => {
                actions.setFieldError("general", error.response.data.message);
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
          validationSchema={yup.object().shape({
            name: yup
              .string()
              .label("Name")
              .max(20)
              .required(),
            surname: yup
              .string()
              .label("Surname")
              .max(30)
              .required(),
            email: yup
              .string()
              .label("Email")
              .email()
              .required(),
            password: yup
              .string()
              .label("Password")
              .required()
              .min(7, "Seems a bit short...")
          })}
        >
          {formikProps => (
            <React.Fragment>
              <FormikInput
                name="name"
                label="Name"
                formikProps={formikProps}
                formikKey="text"
                placeholder="Name"
                className={styles["registration-input"]}
                areaClass={styles["registration-input-area"]}
                autoFocus
              />

              <FormikInput
                name="surname"
                label="Surname"
                formikProps={formikProps}
                formikKey="text"
                placeholder="Surname"
                className={styles["registration-input"]}
                areaClass={styles["registration-input-area"]}
              />

              <FormikInput
                name="email"
                label="Email address"
                formikProps={formikProps}
                formikKey="email"
                placeholder="Email"
                className={styles["registration-input"]}
                areaClass={styles["registration-input-area"]}
              />
              <FormikInput
                name="password"
                label="Password"
                formikProps={formikProps}
                formikKey="password"
                placeholder="Password"
                className={styles["registration-input"]}
                areaClass={styles["registration-input-area"]}
              />

              <button
                type="submit"
                className={styles["registration-button"]}
                onClick={formikProps.handleSubmit}
              >
                Sign up
              </button>

              <p style={{ color: "red" }}>{formikProps.errors.general}</p>
            </React.Fragment>
          )}
        </Formik>
        {this.state.fireRedirect && <Redirect to="/dashboard/rental" />}
      </div>
    );
  }
}

export default RegistrationForm;

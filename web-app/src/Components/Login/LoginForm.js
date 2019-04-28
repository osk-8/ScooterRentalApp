import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";

import styles from "../Login/Login.module.css";
import FormikInput from "../Form/FormikInput";

class LoginForm extends React.Component {
  state = {
    fireRedirect: false
  };

  render() {
    return (
      <div>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            axios
              .post(`http://pascal.fis.agh.edu.pl:1777/login`, {
                email: values.email,
                password: values.password
              })
              .then(response => {
                if (response.data) {
                  localStorage.setItem("userToken", response.data.token);
                  this.setState({
                    fireRedirect: true
                  });
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
            email: yup
              .string()
              .label("Email")
              .email("Invalid email")
              .required("Enter the email"),
            password: yup
              .string()
              .label("Password")
              .required("Enter the password")
              .min(7, "Seems a bit short...")
          })}
        >
          {formikProps => (
            <React.Fragment>
              <FormikInput
                name="email"
                label="Email address"
                formikProps={formikProps}
                formikKey="email"
                placeholder="Email"
                className={styles["login-input"]}
                areaClass={styles["login-input-area"]}
                autoFocus
              />
              <FormikInput
                name="password"
                label="Password"
                formikProps={formikProps}
                formikKey="password"
                placeholder="Password"
                className={styles["login-input"]}
                areaClass={styles["login-input-area"]}
              />

              <button
                type="submit"
                className={styles["login-button"]}
                onClick={formikProps.handleSubmit}
              >
                Sign in
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

export default LoginForm;

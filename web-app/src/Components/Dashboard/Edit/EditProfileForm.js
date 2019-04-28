import React from "react";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

import FormikInput from "../../Form/FormikInput";
import styles from "./Edit.module.css";

class EditProfileForm extends React.Component {
  state = {
    name: "",
    surname: "",
    email: "",
    result: ""
  };

  componentDidMount() {
    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/getUserData",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    }).then(response => {
      if (response.data) {
        this.setState({
          name: response.data.data.imie,
          surname: response.data.data.nazwisko,
          email: response.data.data.adres_email
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            password: ""
          }}
          onSubmit={(values, actions) => {
            axios({
              method: "put",
              url: "http://pascal.fis.agh.edu.pl:1777/updateUser",
              data: {
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password
              },
              headers: {
                "x-access-token": localStorage.getItem("userToken")
              }
            })
              .then(response => {
                this.setState({
                  result: response.data.message
                });
                values.password = "";
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
          enableReinitialize
        >
          {formikProps => (
            <React.Fragment>
              <FormikInput
                name="name"
                label="Name"
                formikProps={formikProps}
                formikKey="text"
                className={styles["edit-input"]}
                areaClass={styles["edit-input-area"]}
                autoFocus
              />
              <FormikInput
                name="surname"
                label="Surname"
                formikProps={formikProps}
                formikKey="text"
                className={styles["edit-input"]}
                areaClass={styles["edit-input-area"]}
              />
              <FormikInput
                name="email"
                label="Email address"
                formikProps={formikProps}
                formikKey="email"
                className={styles["edit-input"]}
                areaClass={styles["edit-input-area"]}
              />
              <FormikInput
                name="password"
                label="Password"
                formikProps={formikProps}
                formikKey="password"
                placeholder="password"
                className={styles["edit-input"]}
                areaClass={styles["edit-input-area"]}
              />
              <button
                type="submit"
                className={styles["edit-button"]}
                onClick={formikProps.handleSubmit}
              >
                Edit
              </button>
              <p style={{ color: "red" }}>{formikProps.errors.general}&nbsp;</p>
              <p style={{ color: "green" }}>{this.state.result}&nbsp;</p>
            </React.Fragment>
          )}
        </Formik>
      </div>
    );
  }
}

export default EditProfileForm;

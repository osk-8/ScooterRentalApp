import React from "react";

import EditProfileForm from "./EditProfileForm";
import DeleteProfileButton from "./DeleteProfileButton";
import styles from "./Edit.module.css";

class Edit extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 className={styles["edit-header"]}>Edit profile</h1>
        <div className={styles["edit-form"]}>
          <EditProfileForm />
        </div>
        <DeleteProfileButton />
      </React.Fragment>
    );
  }
}

export default Edit;

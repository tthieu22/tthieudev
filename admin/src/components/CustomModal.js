import React from "react";
import { Modal } from "antd";

const CustomModal = (props) => {
  const { open, hideModal, performAction, title } = props;
  return (
    <>
      <Modal
        title="DELETE"
        open={open}
        onOk={performAction}
        onCancel={hideModal}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>{title}</p>
      </Modal>
    </>
  );
};

export default CustomModal;

import { useState } from "react";
import { Modal } from "antd";
import AddPlayerForm from "../AddPlayerForm/AddPlayerForm";

const AddPlayerModal = ({ title, visible, handleOk, handleCancel, okText }) => {
  const [player, setPlayer] = useState(null);

  const handleFormChange = (player) => {
    setPlayer(player);
  }

  return (
    <Modal title={title || "Add Player"} visible={visible} onOk={(e) => handleOk(e, player)} onCancel={handleCancel} okText={ okText || "Add Player +"} cancelText="Cancel"> 
      <AddPlayerForm handleSubmit={() => {}}  handleChange={handleFormChange} showAddPlayerButton={false} />
    </Modal>
  )
}

export default AddPlayerModal;
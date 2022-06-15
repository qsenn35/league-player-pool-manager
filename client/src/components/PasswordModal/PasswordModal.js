import { Modal, Input } from "antd"

const PasswordModal = ({ visible, onSuccess, onError }) => {
  const [password, setPassword] = usePassword()

  const handleChange = (e) => {
    console.log(e);
  };

  return (
    <Modal >
      Enter password:
      <Input.Password onChange={handleChange} value={password} />
    </Modal>
  )
}
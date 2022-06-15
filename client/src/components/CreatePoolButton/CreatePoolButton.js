import { Button } from "antd";
import { SERVER_URL } from "../../constants";

const CreatePoolButton = () => {
  const handleClick = async () => {
    try {
      const request = await fetch(`${SERVER_URL}/pools/create`, {
        method: 'POST',
      });
      const response = await request.json();
      console.log(response);
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <Button onClick={handleClick}>Create Pool</Button>
  )
}

export default CreatePoolButton;
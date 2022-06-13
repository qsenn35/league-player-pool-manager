import { Button } from "antd";

const CreatePoolButton = () => {
  const handleClick = async () => {
    try {
      const request = await fetch('localhost:3000/pools/create', {
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
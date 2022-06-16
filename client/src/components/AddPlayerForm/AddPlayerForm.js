import { useReducer } from "react";
import { Button, Form, Input, Select } from "antd";

const { Option } = Select;

const formReducer = (state, action) => {
  switch(action.type) {
    case "SET_STATE":
      return action.payload;
    case "firstName":
      return {
        ...state,
        firstName: action.payload,
      }
    case "lastName":
      return {
        ...state,
        lastName: action.payload,
      }
    case "playerName":
      return {
        ...state,
        playerName: action.payload,
      }
    case "discordTag":
      return {
        ...state,
        discordTag: action.payload,
      }
    case "rank":
      return {
        ...state,
        rank: action.payload,
      }
    case "primaryRole":
      return {
        ...state,
        primaryRole: action.payload,
      }
    case "secondaryRole":
      return {
        ...state,
        secondaryRole: action.payload,
      }
    default:
      return state;
  }
}

const AddPlayerForm = ({ 
  handleChange,
  handleSubmit,
  showAddPlayerButton=true 
}) => {
  const initialState = {
    firstName: "",
    lastName: "",
    playerName: "",
    discordTag: "",
    rank: "IRON",
    primaryRole: "TOP",
    secondaryRole: "TOP",
  };
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSelectChange = (id, value) => {
    dispatch({
      type: id,
      payload: value,
    })
    handleChange({
      ...state,
      [id]: value,
    });
  }

  const _handleChange = (e) => {
    const { target } = e;
    const { id, value } = target;

    dispatch({
      type: id,
      payload: value,
    });
    handleChange({
      ...state,
      [id]: value,
    });
  }

  const _handleSubmit = () => {
    handleSubmit(state);
    dispatch({
      type: 'SET_STATE',
      payload: initialState,
    });
  }

  return (
    <Form 
      onSubmit={_handleSubmit}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 20 }}
      initialValues={state}
    >
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please enter a First Name!" }]}
      >
        <Input placeholder="Johnny" onChange={_handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please enter a Last Name!" }]}
      >
        <Input placeholder="Appleseed" onChange={_handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Player Name"
        name="playerName"
        rules={[{ required: true, message: "Please enter a Player Name (in-game name)!" }]}
      >
        <Input placeholder="Faker" onChange={_handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Discord Tag"
        name="discordTag"
        rules={[{ required: true, message: "Please enter a Discord Tag!" }]}
      >
        <Input placeholder="Faker#1234" onChange={_handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Rank"
        name="rank"
        rules={[{ required: true, message: "Please enter a Rank!" }]}
      >
        <Select onChange={(value) => handleSelectChange("rank", value)}>
          <Option value="IRON">Iron</Option>
          <Option value="BRONZE">Bronze</Option>
          <Option value="SILVER">Silver</Option>
          <Option value="GOLD">Gold</Option>
          <Option value="PLATINUM">Platinum</Option>
          <Option value="DIAMOND">Diamond</Option>
          <Option value="MASTERS">Masters</Option>
          <Option value="GRANDMASTERS">GRANDMASTERS</Option>
          <Option value="CHALLENGER">Challenger</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Primary Role"
        name="primaryRole"
        rules={[{ required: true, message: "Please enter a Primary Role!" }]}
      >
        <Select onChange={(value) => handleSelectChange("primaryRole", value)}>
          <Option value="TOP">Top</Option>
          <Option value="JUNGLE">Jungle</Option>
          <Option value="MID">Mid</Option>
          <Option value="BOT">Bot</Option>
          <Option value="SUPPORT">Support</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Secondary Role"
        name="secondaryRole"
        rules={[{ required: true, message: "Please enter a Secondary Role!" }]}
      >
        <Select onChange={(value) => handleSelectChange("secondaryRole", value)}>
          <Option value="TOP">Top</Option>
          <Option value="JUNGLE">Jungle</Option>
          <Option value="MID">Mid</Option>
          <Option value="BOT">Bot</Option>
          <Option value="SUPPORT">Support</Option>
        </Select>
      </Form.Item>
      {showAddPlayerButton ?
        <Form.Item>
          <Button onClick={_handleSubmit}>Add Player</Button>
        </Form.Item> : <></>}
    </Form>
  )
}

export default AddPlayerForm;
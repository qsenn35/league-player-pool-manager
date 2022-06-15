import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Select,
} from "antd";
import { useReducer } from "react";
import { SERVER_URL } from "../../constants";

const { Option } = Select;

const formReducer = (state, action) => {
  switch(action.type) {
    case "SET_STATE":
      return action.payload;
    case "poolId":
      return {
        ...state,
        poolId: action.payload,
      }
    case "firstName":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    case "lastName":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    case "playerName":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    case "discordTag":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    case "rank":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    case "primaryRole":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    case "secondaryRole":
      return {
        ...state,
        player: { 
          ...state.player,
          ...action.payload,
        },
      }
    default:
      return state;
  }
}

const JoinPoolForm = () => {
  const initialState = {
    poolId: "ba77d93a-bd4e-461d-93a6-41a27143e457",
    player: {
      firstName: "Ian",
      lastName: "Murawski",
      playerName: "Snapcaster",
      discordTag: "lotus#1234",
      rank: "GOLD",
      primaryRole: "TOP",
      secondaryRole: "TOP",
    }
  }
  const [state, dispatch] = useReducer(formReducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const joinRequest = await fetch(`${SERVER_URL}/pools/join`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });

    const joinResponse = await joinRequest.json();

    if (joinRequest.status === 200 && !joinResponse.error) {
      navigate(`/pools/view/${joinResponse.id}`);
    } else if (joinResponse.error) {
      // show error alert
      console.error(joinResponse.error);
    }

    dispatch({
      type: 'SET_STATE',
      payload: initialState,
    })
  }

  const handleSelectChange = (id, value) => {
    dispatch({
      type: id,
      payload: {
        [id]: value,
      }
    })
  }

  const handleChange = (e) => {
    const { target } = e;
    const { id, value } = target;
    if (id === "poolId")
      dispatch({
        type: id,
        payload: value,
      });
    else
      dispatch({
        type: id,
        payload: {
          [id]: value,
        }
      });
  }

  console.log(state);

  return (
    <Form 
      onSubmitCapture={handleSubmit}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 5 }}
      initialValues={{ playerId: state.poolId, ...state.player }}
    >
      <Form.Item
        label="Pool ID"
        name="poolId"
        rules={[{ required: true, message: "Please enter a Pool ID!" }]}
      >
        <Input placeholder="Pool ID" onChange={handleChange}/>
      </Form.Item>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please enter a First Name!" }]}
      >
        <Input placeholder="Johnny" onChange={handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please enter a Last Name!" }]}
      >
        <Input placeholder="Appleseed" onChange={handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Player Name"
        name="playerName"
        rules={[{ required: true, message: "Please enter a Player Name (in-game name)!" }]}
      >
        <Input placeholder="Faker" onChange={handleChange}></Input>
      </Form.Item>
      <Form.Item
        label="Discord Tag"
        name="discordTag"
        rules={[{ required: true, message: "Please enter a Discord Tag!" }]}
      >
        <Input placeholder="Faker#1234" onChange={handleChange}></Input>
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
      <Form.Item
        wrapperCol={{ offset: 2 }}
      >
        <Button onClick={handleSubmit} type="primary">Join Pool</Button>
      </Form.Item>
    </Form>
  )
}

export default JoinPoolForm;
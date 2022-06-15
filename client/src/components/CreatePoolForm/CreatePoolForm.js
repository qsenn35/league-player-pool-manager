import { useReducer } from "react";
import { Button, Form, Input } from "antd";
import "./create-pool-form.css";

const CreatePoolForm = ({ handleChange, handleSubmit }) => {
  const reducer = (state, action) => {
    switch(action.type) {
      case "SET_STATE":
        return action.payload;
      case "title":
        return {
          ...state,
          title: action.payload,
        }
      case "password":
        return {
          ...state,
          password: action.payload
        }
      default:
        return state;
    } 
  }

  const initialState = {
    title: "",
    password: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const _handleChange = (e) => {
    const { target } = e;
    const { id } = target;

    dispatch({
      type: id,
      payload: target.value,
    });

    handleChange(state);
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
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter a Title!" }]}
      >
        <Input placeholder="My New Pool!" onChange={_handleChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={_handleSubmit}>Create Pool</Button>
      </Form.Item>
    </Form>
  )
}

export default CreatePoolForm;
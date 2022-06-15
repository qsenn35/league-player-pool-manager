import { Button, Form, Input, notification, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../constants";
import { useUserContext } from "../../hooks";
import './login.css';

const { Title } = Typography;

const Login = () => {
  const userContext = useUserContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setUser = userContext[1];

  const handleSubmit = async () => {
    try {
      const request = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        })
      });
      const response = await request.json();

      if (response.error)
        return notification.error({
          message: "Error!",
          description: response.error,
        });
      
      setUser(response);
      navigate('/');
    } catch(err) {
      console.error(err);
      notification.error({
        message: "Error!",
        description: "An unknown error occurred.",
      });
    }

  }

  const handleChange = (e) => {    
    const target = e.target;
    const id = target.id;

    switch(id) {
      case "username":
        return setUsername(target.value);
      case "password":
        return setPassword(target.value);
      default:
        return;
    }
  }

  return (
    <div className="Login">
      <div className="Login__form-wrapper App__card">
        <div className="Login__form-wrapper-title">
          <Typography>
            <Title level={3}>Login</Title>
          </Typography>
        </div>
        <Form
          initialValues={{
            username,
            password,
          }}
        >
          <Form.Item
            label="Username"
            name="username"
          >
            <Input placeholder="Faker" onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
          >
            <Input.Password onChange={handleChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>Login</Button>
          </Form.Item>
          <Form.Item>
            Don't have an account? <Link to="/signup">Sign up!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login;
import { Button, Form, Input, notification, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../constants";
import "./register.css";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const request = await fetch(`${SERVER_URL}/signup`, {
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

      if (request.status === 200) {
        notification.success({
          message: "Success!",
          description: "Account created successfully."
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        notification.error({
          message: "Error!",
          description: response.error,
        });
      }
    } catch(err) {
      notification.error({
        message: "Error!",
        description: JSON.stringify(err),
      })
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
    <div className="Register">
      <div className="Register__form-wrapper App__card">
        <div className="Register__form-wrapper-title">
          <Typography>
            <Title level={3}>Sign Up</Title>
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
            <Input placeholder="faker" onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
          >
            <Input.Password onChange={handleChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>Sign up</Button>
          </Form.Item>
          <Form.Item>
            Already have an account? <Link to="/login">Login</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Register;
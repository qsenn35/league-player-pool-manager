import { notification, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { CreatePoolForm, JoinPoolForm } from "../../components";
import { useUserContext } from "../../hooks";
import "./home.css";

const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [user] = useUserContext();

  const handleCreatePool = async (poolData) => {
    try {
      const request = await fetch("http://localhost:3000/pools/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(poolData),
      });
      const response = await request.json();

      if (request.status === 200 && !response.error) {
        notification.success({
          message: "Success!",
          description: "Created pool!",
        });
        navigate(`/pools/edit/${response.id}`);
      } else if (response.error) {
        notification.error({
          message: "Error!",
          description: response.error,
        });
        console.error(response.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="Home">
      <div className="Home__create-pool App__card">
        <div className="Home__create-pool-wrapper-title">
          <h1>Create a Pool</h1>
        </div>
        <div className="Home__create-pool-form-wrapper">
          <CreatePoolForm
            handleSubmit={handleCreatePool}
            handleChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

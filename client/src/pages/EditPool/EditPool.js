import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Modal,
  Tooltip,
  Menu,
  Dropdown,
  notification,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import {
  AddPlayerModal,
  ShareLinkButton,
  PlayerEditableTable,
  TeamEditableTable,
  PageLoader,
  TeamGeneratorDropdown,
} from "../../components";
import "./EditPool.css";
import { useUserContext } from "../../hooks";
import { SERVER_URL } from "../../constants";

const { Title } = Typography;

const EditPool = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user] = useUserContext();

  const { poolId } = params;

  const [pool, setPool] = useState(null);

  // modals
  const [addPlayerModalIsOpen, setAddPlayerModalIsOpen] = useState(false);
  const toggleAddPlayerModal = () =>
    setAddPlayerModalIsOpen(!addPlayerModalIsOpen);

  useEffect(() => {
    const fetchPool = async () => {
      const request = await fetch(`${SERVER_URL}/pools/${poolId}/edit`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const response = await request.json();

      return [response, request.status];
    };

    fetchPool(poolId).then(([response, status]) => {
      if (status !== 200) {
        notification.error({
          message: "Error!",
          description: response.error,
        });
        navigate(`/pools/view/${poolId}`);
      } else {
        setPool(response);
      }
    });
  }, [poolId, user.accessToken, navigate]);

  const requestAddPlayer = async (newPlayer) => {
    try {
      const request = await fetch(`${SERVER_URL}/pools/${poolId}/players/add`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(newPlayer),
      });
      const response = await request.json();
      return response;
    } catch (err) {
      notification.error({
        message: "Error!",
        description: err,
      });
    }
  };

  const handleAddPlayer = (_e, player) => {
    requestAddPlayer(player).then((response) => {
      if (response && response.error) {
        return notification.error({
          message: "Error!",
          description: response.error,
        });
      }

      setPool({
        ...pool,
        players: response.players,
      });

      toggleAddPlayerModal();
      notification.success({
        message: "Success!",
        description: "Player successfully added",
      });
    });
  };

  const requestGenerateTeams = async (teamsType) => {
    try {
      const request = await fetch(
        `${SERVER_URL}/pools/${poolId}/teams/generate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            teamsType,
          }),
        }
      );
      const response = await request.json();
      return response;
    } catch (err) {
      notification.success({
        message: "Error!",
        description: err,
      });
    }
  };

  const handleGenerateTeams = (teamsType) => {
    requestGenerateTeams(teamsType).then((response) => {
      if (response && response.error) {
        notification.error({
          message: "Error!",
          description: response.error,
        });
      } else {
        setPool({
          ...pool,
          teams: response.teams,
        });
        notification.success({
          message: "Success!",
          description: `Teams of type "${teamsType}" generated!`,
        });
      }
    });
  };

  const requestDeletePool = async () => {
    try {
      const request = await fetch(`${SERVER_URL}/pools/${poolId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const response = await request.json();
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleDeletePool = async () => {
    const response = await requestDeletePool();

    if (!response)
      return notification.error({
        message: "Error!",
        description: "An unknown error occurred.",
      });

    if (response && response.error) {
      return notification.error({
        message: "Error!",
        description: response.error,
      });
    }

    navigate("/pools");

    return notification.success({
      message: "Success!",
      description: "Deleted Pool",
    });
  };

  const handleGenerateTeamsConfirm = (teamsType) => {
    Modal.confirm({
      content:
        "Are you sure you want to generate teams? This will wipe all teams currently in the pool.",
      onOk: () => handleGenerateTeams(teamsType),
    });
  };

  const handleDeletePoolConfirm = () => {
    Modal.confirm({
      content: "Are you sure you want to delete this pool?",
      onOk: () => handleDeletePool(),
    });
  };

  if (!pool) return <PageLoader />;

  const teamsFlattened = (pool.teams || []).map((team) => {
    const teamArray = Object.entries(team).reduce(
      (final, [role, player]) => [...final, { ...player, assignedRole: role }],
      []
    );
    return teamArray;
  });

  return (
    <div className="EditPool">
      <Typography>
        <div className="EditPool__header">
          <Title level={2} className="EditPool__header-title">
            {pool.title}
          </Title>
          <Link
            to={`/pools/view/${poolId}`}
            className="EditPool__header-go-to-view"
          >
            Go to view <RightOutlined />
          </Link>
        </div>
        <b>Pool Id: </b>
        {pool.id} <ShareLinkButton />
        <br />
        <b>Created: </b> {pool.created}
        <div className="EditPool__players">
          <Title level={3}>Players</Title>
          <AddPlayerModal
            visible={addPlayerModalIsOpen}
            handleOk={handleAddPlayer}
            handleCancel={toggleAddPlayerModal}
          />
          <div className="EditPool__players-controls">
            <Button onClick={toggleAddPlayerModal} type="primary">
              Add Player +
            </Button>
          </div>
        </div>
        <PlayerEditableTable poolId={poolId} pool={pool} setPool={setPool} />
        <div className="EditPool__teams">
          <Title level={3}>Teams</Title>
          <div className="EditPool__teams-controls">
            <TeamGeneratorDropdown pool={pool} handleGenerateTeamsConfirm={handleGenerateTeamsConfirm} />
          </div>
        </div>
        {teamsFlattened.map((team, index) => {
          return (
            <div key={index}>
              <Title level={4}>Team {index + 1}</Title>
              <TeamEditableTable team={team} />
            </div>
          );
        })}
      </Typography>
      <Button
        type="link"
        className="EditPool__delete-pool"
        onClick={handleDeletePoolConfirm}
      >
        Delete Pool
      </Button>
    </div>
  );
};

export default EditPool;

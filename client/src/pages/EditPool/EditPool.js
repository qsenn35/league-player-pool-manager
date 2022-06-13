import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Popconfirm, Tooltip } from "antd";
import { RightOutlined } from "@ant-design/icons";
import {
  AddPlayerModal,
  ShareLinkButton,
} from "../../components";

import "./EditPool.css";
import PlayerEditableTable from "../../components/PlayerEditableTable/PlayerEditableTable";
import TeamEditableTable from "../../components/TeamEditableTable/TeamEditableTable";

const { Title } = Typography;

const EditPool = () => {
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const { poolId } = params;

  const [pool, setPool] = useState(null);

  // modals
  const [addPlayerModalIsOpen, setAddPlayerModalIsOpen] = useState(false);
  const toggleAddPlayerModal = () =>
    setAddPlayerModalIsOpen(!addPlayerModalIsOpen);

  useEffect(() => {
    if (!password) {
      console.log("password requested");
      const promptResult = prompt("Enter Pool Password");
      setPassword(promptResult);
    }

    const fetchPool = async () => {
      const request = await fetch(
        `http://localhost:3000/pools/${poolId}/edit`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${password}`,
          },
        }
      );
      const response = await request.json();

      return [response, request.status];
    };

    if (password)
      fetchPool(poolId).then(([response, status]) => {
        if (status === 401) {
          alert("Incorrect password!");
          navigate(`/pools/view/${poolId}`);
        }
          
        setPool(response);
      });
  }, [password]);

  const requestAddPlayer = async (newPlayer) => {
    try {
      const request = await fetch(
        `http://localhost:3000/pools/${poolId}/players/add`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${password}`,
          },
          body: JSON.stringify(newPlayer),
        }
      );
      const response = await request.json();
      return response;
    } catch (err) {
      console.error(err);
      // TODO alert error here
    }
  };

  const handleAddPlayer = (_e, player) => {
    console.log(player);

    const newPlayers = [...pool.players, player];

    requestAddPlayer(player).then((response) => {
      if (response && response.error) {
        console.error(response.error);
        // TODO alert error
      }
      setPool({
        ...pool,
        players: newPlayers,
      });

      toggleAddPlayerModal();
    });
  };

  

  if (!pool) return <div>Loading...</div>;

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
        <div className="EditPool__players">
        <Title level={3}>Players</Title>
          <AddPlayerModal
            visible={addPlayerModalIsOpen}
            handleOk={handleAddPlayer}
            handleCancel={toggleAddPlayerModal}
          />
          <div className="EditPool__players-controls">
            <Button
              onClick={toggleAddPlayerModal}
              type="primary"
            >
              Add Player +
            </Button>
          </div>
        </div>
        <PlayerEditableTable poolId={poolId} pool={pool} setPool={setPool} password={password} />
        <div className="EditPool__teams">
          <Title level={3}>Teams</Title>
          <div className="EditPool__teams-controls">
            <Tooltip placement="top" title="10 Player Pools Only">
              <Button type="primary" disabled={pool.players.length > 10 || pool.players.length < 10}>Generate Customs Teams</Button>
            </Tooltip>
            <Tooltip placement="top" title="10 Player Pools Minimum">
              <Button type="primary" disabled={pool.players.length < 10}>Generate Tournament Teams</Button>
            </Tooltip>
            <Tooltip placement="top" title="10 Player Pools Minimum">
              <Button type="primary" disabled={pool.players.length < 10}>Generate Bootcamp Teams</Button>
            </Tooltip>
          </div>
        </div>
        <TeamEditableTable team={{ players: [] }} />
      </Typography>
      <Button type="link" className="EditPool__delete-pool">
        Delete Pool
      </Button>
    </div>
  );
};

export default EditPool;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Table, Typography, notification } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { AddPlayerModal, PageLoader, ShareLinkButton } from "../../components";
import { SERVER_URL } from "../../constants";
import "./ViewPool.css";

const { Title } = Typography;

const playerColumns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Player Name",
    dataIndex: "playerName",
    key: "playerName",
  },
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "Primary Role",
    dataIndex: "primaryRole",
    key: "primaryRole",
  },
  {
    title: "Secondary Role",
    dataIndex: "secondaryRole",
    key: "secondaryRole",
  },
];

const ViewPool = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [pool, setPool] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [flattenedTeams, setFlattenedTeams] = useState([]);
  
  const { poolId } = params;

  useEffect(() => {
    const fetchPool = async () => {
      const request = await fetch(`${SERVER_URL}/pools/${poolId}/view`);
      const response = await request.json();

      return response;
    };

    fetchPool(poolId).then((response) => {
      if (response.error) {
        navigate('/pools');
        return notification.error({
          message: "Error!",
          description: response.error,
        });
        
      }
      
      setPool(response);
    });
  }, [poolId]);

  useEffect(() => {
    if (pool) {
      const teams = (pool.teams || []).map((team) => {
        const teamArray = Object.entries(team).reduce(
          (final, [role, player]) => [...final, { ...player, assignedRole: role }],
          []
        );
        return teamArray;
      });

      setFlattenedTeams(teams);
    }
  }, [pool])

  const toggleJoinModal = () => setShowJoinModal(!showJoinModal);

  const requestJoinPool = async (newPlayer) => {
    try {
      const request = await fetch(
        `${SERVER_URL}/pools/join`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            poolId,
            player: newPlayer,
          }),
        }
      );
      const response = await request.json();
      return response;
    } catch (err) {
      notification.error({
        message: "Error!",
        description: err,
      });
    }
  };

  const handleJoinPool = (_e, player) => {
    requestJoinPool(player).then((response) => {
      if (response.error) {
        return notification.error({
          message: "Error!",
          description: response.error,
        });
      }

      setPool({
        ...pool,
        players: response.players,
      });
      
      toggleJoinModal();
      notification.success({
        message: "Success!",
        description: "Joined pool!",
      });
    });
  };

  const createTeamColumns = (team) => ([
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      filters: team.map(player => ({ text: player.firstName, value: player.firstName })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.firstName.startsWith(value),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      filters: team.map(player => ({ text: player.lastName, value: player.lastName })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.lastName.startsWith(value),
    },
    {
      title: "Discord",
      dataIndex: "discordTag",
      key: "discordTag",
      filters: team.map(player => ({ text: player.discordTag, value: player.discordTag })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.discordTag === value,
    },
    {
      title: "Player Name",
      dataIndex: "playerName",
      key: "playerName",
      filters: team.map(player => ({ text: player.playerName, value: player.playerName })),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.playerName.startsWith(value),
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Assigned Role",
      dataIndex: "assignedRole",
      key: "assignedRole",
    },
    {
      title: "Primary Role",
      dataIndex: "primaryRole",
      key: "primaryRole",
    },
    {
      title: "Secondary Role",
      dataIndex: "secondaryRole",
      key: "secondaryRole",
    },
  ]);

  if (!pool) return <PageLoader/>;

  return (
    <div className="ViewPool">
      <Typography>
        <div className="ViewPool__header">
          <Title level={2} className="ViewPool__header-title">
            {pool.title}
          </Title>
          <Link
            to={`/pools/edit/${poolId}`}
            className="ViewPool__header-go-to-edit"
          >
            Go to edit <RightOutlined />
          </Link>
        </div>
        <b>Pool Id: </b>
        {pool.id} <ShareLinkButton />
        <div className="ViewPool__players">
          <Title level={3}>Players</Title>
          <AddPlayerModal
            title="Join Pool"
            visible={showJoinModal}
            handleOk={handleJoinPool}
            handleCancel={toggleJoinModal}
            okText="Join Pool"
          />
          <div className="ViewPool__players-controls">
            <Button type="primary" onClick={toggleJoinModal}>
              Join Pool
            </Button>
          </div>
          <Table dataSource={pool.players} columns={playerColumns} />
        </div>
        <Title level={3}>Teams</Title>
        {
          flattenedTeams.map((team, index) => (
            <div key={index}>
              <Title level={4}>Team {index + 1}</Title>
              <Table dataSource={team} columns={createTeamColumns(team)} />
            </div>
          ))
        }
      </Typography>
    </div>
  );
};

export default ViewPool;

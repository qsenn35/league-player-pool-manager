import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, Table, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { AddPlayerModal, ShareLinkButton } from "../../components";

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

const teamColumns = [
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
  const [pool, setPool] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const params = useParams();
  const toggleJoinModal = () => setShowJoinModal(!showJoinModal);
  const { poolId } = params;

  const fetchPool = async () => {
    const request = await fetch(`http://localhost:3000/pools/${poolId}/view`);
    const response = await request.json();

    return response;
  };

  useEffect(() => {
    fetchPool(poolId).then((response) => {
      setPool(response);
    });
  }, []);

  if (!pool) return <div>Loading...</div>;

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
            handleOk={toggleJoinModal}
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
        <Table dataSource={[]} columns={teamColumns} />
      </Typography>
    </div>
  );
};

export default ViewPool;

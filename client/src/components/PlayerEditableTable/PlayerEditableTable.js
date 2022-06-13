import { Popconfirm } from "antd";
import { EditableTable } from "../../components";

const PlayerEditableTable = ({ pool, setPool, password }) => {
  const poolId = pool.id;

  const requestEditPlayer = async (newPlayer) => {
    console.log(newPlayer)
    try {
      const request = await fetch(
        `http://localhost:3000/pools/${poolId}/players/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${password}`,
          },
          body: JSON.stringify({
            playerId: newPlayer.id,
            player: newPlayer,
          }),
        }
      );
      const response = await request.json();
      return response;
    } catch (err) {
      console.error(err);
      // TODO: alert error here
    }
  };

  const requestRemovePlayer = async (playerId) => {
    try {
      const request = await fetch(
        `http://localhost:3000/pools/${poolId}/players/remove`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${password}`,
          },
          body: JSON.stringify({
            playerId,
          }),
        }
      );
      const response = await request.json();
      return response;
    } catch (err) {
      console.error(err);
      // TODO alert error here
    }
  };

  const handleSave = (e) => {
    const newPlayers = pool.players.map((player) => {
      if (player.id === e.id) {
        console.log("matched");
        return e;
      }
      return player;
    });

    requestEditPlayer(e).then((response) => {
      if (response && response.error) {
        console.error(response.error);
        // TODO alert error
      }
      setPool({
        ...pool,
        players: newPlayers,
      });
    });
  };

  const handleDelete = (e) => {
    const newPlayers = pool.players.filter((player) => player.id !== e.id);

    requestRemovePlayer(e.id).then((response) => {
      if (response && response.error) {
        console.error(response.error);
        // TODO alert error
      }
      setPool({
        ...pool,
        players: newPlayers,
      });
    });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Discord",
      dataIndex: "discordTag",
      key: "discordTag",
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
    {
      title: "Operations",
      dataIndex: "operation",
      render: (_, record) =>
        pool.players.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const editableColumns = columns.map((col) => {
    if (col.dataIndex === "rank")
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
          isSelect: true,
          selectOptions: [
            { value: "IRON", label: "Iron" },
            { value: "BRONZE", label: "Bronze" },
            { value: "SILVER", label: "Silver" },
            { value: "GOLD", label: "Gold" },
            { value: "PLATINUM", label: "Platinum" },
            { value: "DIAMOND", label: "Diamond" },
            { value: "MASTERS", label: "Masters" },
            { value: "GRANDMASTERS", label: "Grandmasters" },
            { value: "CHALLENGER", label: "Challenger" },
          ],
        }),
      };
    if (col.dataIndex === "primaryRole" || col.dataIndex === "secondaryRole")
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
          isSelect: true,
          selectOptions: [
            { value: "TOP", label: "Top" },
            { value: "JUNGLE", label: "Jungle" },
            { value: "MID", label: "Mid" },
            { value: "BOT", label: "Bot" },
            { value: "SUPPORT", label: "Support" },
          ],
        }),
      };

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        isSelect: false,
        selectOptions: [],
      }),
    };
  });

  return (
    <EditableTable dataSource={pool.players} columns={editableColumns} />
  )
}

export default PlayerEditableTable;
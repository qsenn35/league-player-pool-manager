import { useEffect, useState } from "react";
import { Button, notification, Popconfirm } from "antd";
import { EditableTable } from "../../components";
import { useUserContext } from "../../hooks";

const PlayerEditableTable = ({ pool, setPool }) => {
  const [user] = useUserContext();
  const [tableFilters, setTableFilters] = useState({
    firstName: [],
    lastName: [],
    discordTag: [],
    playerName: [],
  });

  const poolId = pool.id;

  useEffect(() => {
    const tableFilters = pool.players.reduce((filters, player) => ({
      firstName: [ ...filters.firstName, { text: player.firstName, value: player.firstName } ],
      lastName: [ ...filters.lastName, { text: player.lastName, value: player.lastName } ],
      discordTag: [ ...filters.discordTag, { text: player.discordTag, value: player.discordTag } ],
      playerName: [ ...filters.playerName, { text: player.playerName, value: player.playerName } ],
    }), {
      firstName: [],
      lastName: [],
      discordTag: [],
      playerName: [],
    });
    setTableFilters(tableFilters);
    console.log(pool.players);
  }, [pool]);

  const requestEditPlayer = async (newPlayer) => {
    try {
      const request = await fetch(
        `http://localhost:3000/pools/${poolId}/players/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
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
      notification.error({
        message: "Error!",
        description: err,
      });
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
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify({
            playerId,
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

  const handleSave = (e) => {
    requestEditPlayer(e).then((response) => {
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
    });
  };

  const handleDelete = (e) => {
    const newPlayers = pool.players.filter((player) => player.id !== e.id);

    requestRemovePlayer(e.id).then((response) => {
      if (response && response.error) {
        notification.error({
          message: "Error!",
          description: response.error,
        });
      }
      
      setPool({
        ...pool,
        players: newPlayers,
      });

      notification.success({
        message: "Success!",
        description: "Deleted player.",
      });
    });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      filters: tableFilters.firstName,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.firstName === value,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      filters: tableFilters.lastName,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.lastName === value,
    },
    {
      title: "Discord",
      dataIndex: "discordTag",
      key: "discordTag",
      filters: tableFilters.discordTag,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.discordTag === value,
    },
    {
      title: "Player Name",
      dataIndex: "playerName",
      key: "playerName",
      filters: tableFilters.playerName,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.playerName === value,
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
            <Button type="link">Delete</Button>
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
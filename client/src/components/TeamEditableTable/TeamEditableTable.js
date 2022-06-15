import { EditableTable } from "../../components";

const TeamEditableTable = ({ pool, team }) => {

  const handleSave = () => {

  }

  const columns = [
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
    <EditableTable dataSource={team} columns={editableColumns} pagination={false} />
  )
}

export default TeamEditableTable;

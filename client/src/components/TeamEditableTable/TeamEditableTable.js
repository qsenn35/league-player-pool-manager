import { EditableTable } from "../../components";

const TeamEditableTable = ({ pool, team }) => {

  const handleSave = () => {

  }

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
      dataIndex: "discord",
      key: "discord",
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
    <EditableTable dataSource={team.players} columns={editableColumns} />
  )
}

export default TeamEditableTable;

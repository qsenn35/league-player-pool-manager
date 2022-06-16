import { Button, Dropdown, Menu, Tooltip } from "antd";

const TeamGeneratorMenu = ({ pool, handleGenerateTeamsConfirm }) => {
  return (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Tooltip placement="right" title="10 Player Pools Minimum">
              <div
                type="primary"
                disabled={pool.players.length < 10}
                onClick={() => handleGenerateTeamsConfirm("random")}
              >
                Randomize Teams
              </div>
            </Tooltip>
          ),
        },
        {
          key: "2",
          label: (
            <Tooltip placement="right" title="10 Player Pools Only">
              <div
                type="primary"
                disabled={pool.players.length !== 10}
                onClick={() => handleGenerateTeamsConfirm("customs")}
              >
                Generate Customs Teams
              </div>
            </Tooltip>
          ),
        },
        {
          key: "3",
          label: (
            <Tooltip placement="right" title="10 Player Pools Minimum">
              <div
                disabled={pool.players.length < 10}
                onClick={() => handleGenerateTeamsConfirm("tournament")}
              >
                Generate Tournament Teams
              </div>
            </Tooltip>
          ),
        },
        {
          key: "4",
          label: (
            <Tooltip placement="right" title="10 Player Pools Minimum">
              <div
                type="primary"
                disabled={pool.players.length < 10}
                onClick={() => handleGenerateTeamsConfirm("bootcamp")}
              >
                Generate Bootcamp Teams
              </div>
            </Tooltip>
          ),
        },
      ]}
    />
  );
};

const TeamGeneratorDropdown = ({ pool, handleGenerateTeamsConfirm }) => {
  return (
    <Dropdown
      overlay={
        <TeamGeneratorMenu
          pool={pool}
          handleGenerateTeamsConfirm={handleGenerateTeamsConfirm}
        />
      }
    >
      <Button>Generate Teams</Button>
    </Dropdown>
  );
};

export default TeamGeneratorDropdown;

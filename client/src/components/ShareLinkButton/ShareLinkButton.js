import { Button, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const ShareLinkButton = () => {

  const handleClick = () => {
    navigator.clipboard.writeText(window.location)
      .then(() => {
        // TODO: alert copied
      })
  }

  return (
    <Tooltip placement="top" title="Copy Link">
      <Button onClick={handleClick}>
        <CopyOutlined />
      </Button>
    </Tooltip>
  )
}

export default ShareLinkButton;
import { Button, notification, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const ShareLinkButton = () => {

  const handleClick = () => {
    navigator.clipboard.writeText(window.location)
      .then(() => {
        notification.success({
          message: "Copied!",
        })
      })
  }

  return (
    <Tooltip placement="top" title="Copy Link">
      <Button onClick={handleClick}>
        Copy Link <CopyOutlined />
      </Button>
    </Tooltip>
  )
}

export default ShareLinkButton;
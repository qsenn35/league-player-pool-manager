import { Spin } from "antd";

const PageLoader = () => {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large"/>
    </div>
  );
};

export default PageLoader;

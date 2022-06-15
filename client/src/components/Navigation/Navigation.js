import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import "./navigation.css";

const { TabPane } = Tabs;

const Navigation = ({ routes }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavigation = () => setIsOpen(!isOpen);

  const handleTabChange = (path) => {
    navigate(path);
    setTimeout(() => toggleNavigation(), 250);
  };

  return (
    <div className="Navigation__wrapper">
      {!isOpen ? (
        <MenuOutlined
          style={{ fontSize: 30, cursor: "pointer", margin: "20px", position: "fixed" }}
          onClick={toggleNavigation}
        />
      ) : (
        <div></div>
      )}
      <div
        className={`Navigation ${
          isOpen ? "Navigation__opened" : "Navigation__closed"
        }`}
      >
        <div className="Navigation__header">
          <div className="Navigation__header-close-btn">
            <CloseOutlined onClick={toggleNavigation} />
          </div>
        </div>
        <Tabs
          defaultActiveKey={location.pathname}
          tabPosition="left"
          onTabClick={handleTabChange}
          tabBarStyle={{
            width: "100%",
          }}
        >
          {routes.map((route) => (
            <TabPane tab={route.label} key={route.path}></TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Navigation;

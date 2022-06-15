import { Navigation } from "../../components";
import "./PortalLayout.css";

const PortalLayout = ({ children }) => {
  const routes = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "My Pools",
      path: "/pools",
    },
  ]

  return (
    <div className="PortalLayout">
      <div className="PortalLayout__nav-wrapper">
        <Navigation routes={routes}></Navigation>
      </div>
      <div className="PortalLayout__main-wrapper">
        { children }
      </div>
    </div>
  )
}

export default PortalLayout;
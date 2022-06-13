import "./PortalLayout.css";

const PortalLayout = ({ children }) => {
  return (
    <div className="PortalLayout">
      <div className="PortalLayout__main">
        { children }
      </div>
    </div>
  )
}

export default PortalLayout;
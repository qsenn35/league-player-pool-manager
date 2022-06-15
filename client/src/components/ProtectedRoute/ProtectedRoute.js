import { Navigate } from "react-router-dom";
import { useUserContext } from "../../hooks"

const ProtectedRoute = ({ children }) => {
  const [user] = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children;
}

export default ProtectedRoute;
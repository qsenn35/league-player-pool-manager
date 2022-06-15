import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, ViewPool, EditPool, Login, Register, MyPools } from "./pages";
import { PortalLayout } from "./layouts";
import { UserContextProvider } from "./contexts/UserContext";
import { ProtectedRoute } from "./components";

const ContextWrapper = ({ children }) => {
  return (
    <UserContextProvider>
      { children }
    </UserContextProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route
          path="/login"
          element={
            <ContextWrapper>
              <Login />
            </ContextWrapper>
          }
        />
        <Route
          path="/"
          element={
            <ContextWrapper>
              <ProtectedRoute>
                <PortalLayout>
                  <Home />
                </PortalLayout>
              </ProtectedRoute>
            </ContextWrapper>
          }
        />
        <Route
          path="/pools"
          element={
            <ContextWrapper>
              <ProtectedRoute>
                <PortalLayout>
                  <MyPools />
                </PortalLayout>
              </ProtectedRoute>
            </ContextWrapper>
          }
        />
        <Route
          path="/pools/view/:poolId"
          element={
            <ContextWrapper>
              <PortalLayout>
                <ViewPool />
              </PortalLayout>
            </ContextWrapper>
          }
        />
        <Route
          path="/pools/edit/:poolId"
          element={
            <ContextWrapper>
              <ProtectedRoute>
                <PortalLayout>
                  <EditPool />
                </PortalLayout>
              </ProtectedRoute>
            </ContextWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

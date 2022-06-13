import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { Home, ViewPool, EditPool } from './pages';
import { PortalLayout } from './layouts';

function App() {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalLayout><Home/></PortalLayout>} />
        <Route path="/pools/view/:poolId" element={<PortalLayout><ViewPool/></PortalLayout>} />
        <Route path="/pools/edit/:poolId" element={<PortalLayout><EditPool/></PortalLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

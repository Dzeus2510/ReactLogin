import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./pages/Sidebar";
import Login from './pages/Login';
import DashboardBill from './pages/DashboardBill';
import Insert from './pages/InsertBill';
import Edit from './pages/EditBill';
import DashboardProduct from './pages/DashboardProduct';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div className="App">

      <Router>
        <Box sx={{ display: "flex" }}>
          <Sidebar />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Routes>
              { /*Route Login sẽ nhận setUser để set người dùng*/}
              <Route path="/login" element={<Login setUser={setUser} />} />
              { /*Route Dashboard sẽ nhận user để lấy username, và nếu user = null sẽ redirect lại về trang /*/}
              <Route path="/dashboard" element={< DashboardBill />} />
              <Route path="/add-bill" element={< Insert />} />
              <Route path="/edit-bill/:id" element={< Edit />} />
              <Route path="/products" element={<DashboardProduct />} />
            </Routes>
          </Box>
        </Box>

      </Router>
    </div>
  );
}

export default App;

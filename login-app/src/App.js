import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, createTheme, ThemeProvider, Toolbar } from "@mui/material";
import Sidebar from "./pages/Sidebar";
import DashboardBill from './pages/DashboardBill';
import Insert from './pages/InsertBill';
import Edit from './pages/EditBill';
import DashboardProduct from './pages/DashboardProduct';
import InsertProduct from './pages/InsertProduct';
import EditProduct from './pages/EditProduct';

function App() {

  const theme = createTheme({
    typography: {
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    h1: {
      display: "block",
      marginblockStart: "0.67em",
      marginblockEnd: "0.67em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontSize: "8px",
      fontWeight: 550,
    },
    MuiMuiTextField: {
      fontSize: "7px",
      
    }
  })

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Box sx={{ display: "flex" }}>
            <Sidebar />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Toolbar />
              <Routes>
                <Route path="/dashboard" element={< DashboardBill />} />
                <Route path="/add-bill" element={< Insert />} />
                <Route path="/edit-bill/:id" element={< Edit />} />
                <Route path="/products" element={<DashboardProduct />} />
                <Route path="/add-product" element={<InsertProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
              </Routes>
            </Box>
          </Box>

        </Router>
      </ThemeProvider>

    </div>
  );
}

export default App;

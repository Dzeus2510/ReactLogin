import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BarcodeReaderIcon from '@mui/icons-material/BarcodeReader';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const drawerWidth = open ? 240 : 80;

  const menuItems = [
    { text: "Dashboard Bills", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Add Bill", icon: < AddCircleIcon/>, path: "/add-bill" },
    { text: "Dashboard Products", icon: <ListAltIcon />, path: "/products" },
    { text: "Add Product", icon: <BarcodeReaderIcon />, path: "/" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "width 0.3s",
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "rgb(25, 37, 56)",
          color: "white",
          overflowX: "hidden",
          transition: "width 0.3s",
        },
      }}
    >

      <Toolbar sx={{ px: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center">
            <ShoppingCartIcon sx={{ fontSize: 28, mr: open ? 1 : 0, color: "white" }} />
            {open && (
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
                Sapo
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "white" }}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={!open ? item.text : ""} placement="right">
            <ListItem
              button
              component={Link}
              to={item.path}
              sx={{ py: 1, px: 1, color: "white" }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

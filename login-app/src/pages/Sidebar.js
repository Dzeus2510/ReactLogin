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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const drawerWidth = open ? 200 : 60; // full vs collapsed

  const menuItems = [
    { text: "Dashboard Bills", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Add Bill", icon: <AddCircleIcon />, path: "/add-bill" },
    { text: "Dashboard Products", icon: <ListAltIcon />, path: "/products" },
    { text: "Add Product", icon: <QrCodeScannerIcon />, path: "/add-product" },
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
      {/* Top Logo + Toggle */}
      <Toolbar sx={{ px: 1, justifyContent: open ? "space-between" : "center" }}>
        {open ? (
          <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <ShoppingCartIcon sx={{ fontSize: 28, mr: 1, color: "white" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
                Sapo
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={() => setOpen(true)} sx={{ color: "white" }}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </Toolbar>

      <List sx={{ mt: 2}}>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right">
            <ListItem
              button
              component={Link}
              to={item.path}
              sx={{
                py: 1,
                px: 1,
                color: "white",
                justifyContent: open ? "flex-start" : "center", 
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0, // remove left spacing
                  color: "white",
                  mr: open ? 2 : 0, // spacing only when expanded
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text}
              primaryTypographyProps={{ fontSize: 14, fontFamily: "Inter" }}/>}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

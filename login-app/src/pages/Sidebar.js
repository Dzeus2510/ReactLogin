import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const drawerWidth = open ? 230 : 50;

  const handleToggleSubmenu = () => setSubmenuOpen(!submenuOpen);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        fontSize: 14,
        flexShrink: 0,
        whiteSpace: "nowrap",
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: 1,
          py: 1,
        }}
      >
        {open ? (
          <>
            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="https://bizweb.sapocdn.net/dev/admin/frontend/assets/sapo-logo-ncFhCziL.svg"
                alt="logo"
                style={{ display: "block", height: 32, width: 130, marginRight: 8 }}
              />
            </a>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => setOpen(true)} sx={{ color: "white" }}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>


      {/* Main Menu */}
      <List sx={{ mt: 2 }}>
        {/* Tổng quan */}
        <Tooltip title="Tổng quan" placement="right" disableHoverListener={open}>
          <ListItem
            button
            component={Link}
            to="/"
            sx={{
              py: 1,
              px: 1.5,
              color: "white",
              justifyContent: open ? "flex-start" : "center",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: "white",
                mr: open ? 2 : 0,
                justifyContent: "center",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Tổng quan"
                primaryTypographyProps={{ fontSize: 14, fontFamily: "Inter" }}
              />
            )}
          </ListItem>
        </Tooltip>

        {/* Đơn hàng */}
        <Tooltip title="Đơn hàng" placement="right" disableHoverListener={open}>
          <ListItem
            button
            component={Link}
            to="/dashboard"
            sx={{
              py: 1,
              px: 1.5,
              color: "white",
              justifyContent: open ? "flex-start" : "center",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: "white",
                mr: open ? 2 : 0,
                justifyContent: "center",
              }}
            >
              <ListAltIcon />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Đơn hàng"
                primaryTypographyProps={{ fontSize: 14, fontFamily: "Inter" }}
              />
            )}
          </ListItem>
        </Tooltip>

        {/* Sản phẩm with submenu */}
        <Tooltip title="Sản phẩm" placement="right" disableHoverListener={open}>
          <ListItem
            button
            onClick={handleToggleSubmenu}
            sx={{
              py: 1,
              px: 1.5,
              color: "white",
              justifyContent: open ? "flex-start" : "center",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                color: "white",
                mr: open ? 2 : 0,
                justifyContent: "center",
              }}
            >
              <AddCircleIcon />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Sản phẩm"
                primaryTypographyProps={{ fontSize: 14, fontFamily: "Inter" }}
              />
            )}
            {open && (submenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </Tooltip>

        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/products"
              sx={{
                pl: open ? 6 : 2,
                color: "rgba(255,255,255,0.8)",
                "&:hover": { background: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemText
                primary="Danh sách sản phẩm"
                primaryTypographyProps={{ fontSize: 13, fontFamily: "Inter" }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/"
              sx={{
                pl: open ? 6 : 2,
                color: "rgba(255,255,255,0.8)",
                "&:hover": { background: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemText
                primary="Danh mục sản phẩm"
                primaryTypographyProps={{ fontSize: 13, fontFamily: "Inter" }}
              />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/add-product"
              sx={{
                pl: open ? 6 : 2,
                color: "rgba(255,255,255,0.8)",
                "&:hover": { background: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemText
                primary="Thêm sản phẩm"
                primaryTypographyProps={{ fontSize: 13, fontFamily: "Inter" }}
              />
            </ListItem>
          </List>
        </Collapse>

        {/* Divider + Section heading */}
        <Divider sx={{ my: 2, background: "rgba(255,255,255,0.2)" }} />
        {open && (
          <Typography
            variant="caption"
            sx={{ px: 2, color: "rgba(255,255,255,0.6)", fontFamily: "Inter", fontSize: 12 }}
          >
            KÊNH BÁN HÀNG
          </Typography>
        )}
      </List>
    </Drawer>
  );
}

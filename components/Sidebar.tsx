"use client"

import type React from "react"
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const drawerWidth = 240

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        {/* You can add a logo or title here */}
        AI Platform
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" onClick={isMobile ? onClose : undefined}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/ai-assistant" onClick={isMobile ? onClose : undefined}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="AI Assistant" />
        </ListItem>
        <ListItem button component={Link} to="/users" onClick={isMobile ? onClose : undefined}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/tasks" onClick={isMobile ? onClose : undefined}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/settings" onClick={isMobile ? onClose : undefined}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar

// Named export for compatibility
export { Sidebar }

import { useState, useEffect } from "react";
import { IconButton, Menu, MenuItem, Avatar, Box, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import {jwtDecode} from "jwt-decode";

export default function UserMenu({ onOpenHistory }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch {
        setUsername("");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); 
  };

  return (
    <Box>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color="inherit"
        size="small"
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}>
          {username[0]?.toUpperCase() || "?"}
        </Avatar>
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 150,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="black" noWrap>
            Usuário: {username}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onOpenHistory();
            setAnchorEl(null);
          }}
        >
          Ver Histórico
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}

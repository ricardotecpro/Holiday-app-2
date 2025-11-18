import React, { useContext } from "react";
import { HolidayContext } from "../contexts/HolidayContext";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function SearchHistory({ open, onClose }) {
  const { state } = useContext(HolidayContext);
  const { searchHistory } = state;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Typography variant="h6">Histórico de Busca</Typography>
        {searchHistory.length === 0 ? (
          <Typography>Sem histórico de buscas.</Typography>
        ) : (
          <List>
            {searchHistory.map((item, index) => (
              <ListItem button key={index}>
                <ListItemText primary={`${item.year} - ${item.country}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}

import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

export default function CustomHolidayForm({ onAdd, onEdit, existingHoliday, onClose }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [type, setType] = useState("");

  // Se for modo de edição, popular os campos
  useEffect(() => {
    if (existingHoliday) {
      setName(existingHoliday.name || "");
      setDate(existingHoliday.date || "");
      setCountryCode(existingHoliday.countryCode || "");
      setType(existingHoliday.type || "");
      setOpen(true);
    }
  }, [existingHoliday]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose(); // fecha modal externo se existir
  };

  const handleSubmit = async () => {
    if (!name || !date || !countryCode || !type) {
      alert("Preencha todos os campos");
      return;
    }

    const payload = { name, date, countryCode, type };

    try {
      let response, data;

      if (existingHoliday) {
        // Editar feriado
        response = await fetch(`https://localhost:3001/holidays/${existingHoliday.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Erro ao editar feriado");

        data = await response.json();
        if (onEdit) onEdit(data);
      } else {
        // Criar feriado
        response = await fetch("https://localhost:3001/holidays", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Erro ao adicionar feriado");

        data = await response.json();
        if (onAdd) onAdd(data);
      }

      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {!existingHoliday && (
        <Button variant="contained" onClick={handleOpen}>
          Adicionar Feriado
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{existingHoliday ? "Editar" : "Adicionar"} Feriado Personalizado</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Data"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Código do País"
            fullWidth
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            helperText="Exemplo: BR, US, DE"
          />
          <TextField
            margin="dense"
            label="Tipo"
            select
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Bank">Bank</MenuItem>
            <MenuItem value="School">School</MenuItem>
            <MenuItem value="Optional">Optional</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

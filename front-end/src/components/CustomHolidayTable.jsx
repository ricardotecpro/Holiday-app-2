import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Button,
  Tooltip, TextField, Box, Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import { HolidayContext } from "../contexts/HolidayContext";
import CustomHolidayForm from "./CustomHolidayForm";
import dayjs from "dayjs";

export default function CustomHolidayTable({ onClose }) {
  const { dispatch } = useContext(HolidayContext);

  const [holidays, setHolidays] = useState([]);
  const [filters, setFilters] = useState({ name: "", countryCode: "", year: "" });
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:3001/holidays", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setHolidays(data);
      dispatch({ type: "SET_CUSTOM_HOLIDAYS", payload: data });
    };

    fetchHolidays();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:3001/holidays/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Erro ao excluir feriado.");
      const updated = holidays.filter(h => h.id !== id);
      setHolidays(updated);
      dispatch({ type: "SET_CUSTOM_HOLIDAYS", payload: updated });
      setConfirmDelete(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdate = (updated) => {
    const updatedList = holidays.map(h => h.id === updated.id ? updated : h);
    setHolidays(updatedList);
    dispatch({ type: "SET_CUSTOM_HOLIDAYS", payload: updatedList });
    setEditingHoliday(null);
  };

  const filtered = holidays.filter(h => {
    const matchName = h.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchCountry = h.countryCode.toLowerCase().includes(filters.countryCode.toLowerCase());
    const matchYear = filters.year ? dayjs(h.date).year() === parseInt(filters.year) : true;
    return matchName && matchCountry && matchYear;
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Feriados Personalizados Cadastrados</Typography>

      {/* Filtros */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <TextField
          label="Nome"
          value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })}
        />
        <TextField
          label="Código do país"
          value={filters.countryCode}
          onChange={e => setFilters({ ...filters, countryCode: e.target.value })}
        />
        <TextField
          label="Ano"
          type="number"
          value={filters.year}
          onChange={e => setFilters({ ...filters, year: e.target.value })}
        />
        <Button onClick={() => setFilters({ name: "", countryCode: "", year: "" })}>
          Limpar Filtros
        </Button>
      </Box>

      {filtered.length === 0 ? (
        <Typography>Nenhum feriado encontrado.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Data</strong></TableCell>
                <TableCell><strong>País</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(h => (
                <TableRow key={h.id}>
                  <TableCell>{h.name}</TableCell>
                  <TableCell>{dayjs(h.date).format("DD/MM/YYYY")}</TableCell>
                  <TableCell>{h.countryCode}</TableCell>
                  <TableCell>{h.type || "N/A"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => setEditingHoliday(h)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton onClick={() => setConfirmDelete(h)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de edição */}
      {editingHoliday && (
        <Dialog open onClose={() => setEditingHoliday(null)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Editar Feriado
            <IconButton onClick={() => setEditingHoliday(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <CustomHolidayForm
              existingHoliday={editingHoliday}
              onEdit={handleUpdate}
              onClose={() => setEditingHoliday(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmação de exclusão */}
      {confirmDelete && (
        <Dialog open onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir o feriado <strong>{confirmDelete.name}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button color="error" onClick={() => handleDelete(confirmDelete.id)}>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

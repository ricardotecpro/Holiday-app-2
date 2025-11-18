import { useContext, useState, useEffect } from "react";
import { HolidayContext } from "../contexts/HolidayContext";
import HolidayCard from "./HolidayCard";
import { CircularProgress, Typography, TextField, Box, Button, Select, MenuItem, ToggleButton, ToggleButtonGroup } from "@mui/material";
import dayjs from "dayjs";
import styled from 'styled-components';
import CustomHolidayForm from "./CustomHolidayForm";
import CustomHolidayTable from "./CustomHolidayTable";


export default function HolidayList() {
  const { state, dispatch } = useContext(HolidayContext);
  const { apiHolidays, customHolidays, activeSource, loading, error, searchHistory } = state;

  const [filterMonth, setFilterMonth] = useState("");
  const [filterType, setFilterType] = useState("");
  const holidayTypes = [
    "Public",
    "Bank",
    "School",
    "Optional"
  ]

  const selectedHolidays = activeSource === "api" ? apiHolidays : customHolidays;

  useEffect(() => {
    if (activeSource === "custom") {
      const fetchCustomHolidays = async () => {
        dispatch({ type: "FETCH_START" });
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("https://localhost:3001/holidays", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Erro ao buscar feriados personalizados");
          }

          const data = await res.json();
          dispatch({ type: "SET_CUSTOM_HOLIDAYS", payload: data });
        } catch (err) {
          dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
      };

      fetchCustomHolidays();
    }
  }, [activeSource, dispatch]);


  const filterHolidays = () => {
    return selectedHolidays.filter((holiday) => {

      const monthMatch = filterMonth ? dayjs(holiday.date).month() + 1 === parseInt(filterMonth) : true;
      const typeMatch = filterType ? Array.isArray(holiday.types) && holiday.types.includes(filterType) : true;
      return monthMatch && typeMatch;

    });
  }

  const filteredHolidays = filterHolidays();

  const handleAddCustomHoliday = (newHoliday) => {
    dispatch({ type: "ADD_CUSTOM_HOLIDAY", payload: newHoliday });
  };


  return (
    <StyledWrapper>
      <Box className="container">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {searchHistory.length > 0 && (
              <>
                {/* Botões para alternar entre API e Custom */}
                <Box className="toggle">
                  <ToggleButtonGroup
                    value={activeSource}
                    exclusive
                    onChange={(e, newSource) => {
                      if (newSource !== null) {
                        dispatch({ type: "SET_ACTIVE_SOURCE", payload: newSource });
                      }
                    }}
                  >
                    <ToggleButton value="api">Feriados da API</ToggleButton>
                    <ToggleButton value="custom">Feriados Personalizados</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {activeSource === "custom" ? (
                  <>
                    <Box mb={2} mt={5}>
                      <CustomHolidayForm onAdd={handleAddCustomHoliday} />
                    </Box>
                    <CustomHolidayTable />
                  </>
                ) : (
                  <>
                    {/* Filtros só para API */}
                    <Box className="filters">
                      <TextField
                        label="Filtrar por mês"
                        type="number"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        helperText="Digite o número do mês (1-12)"
                        inputProps={{ min: 1, max: 12 }}
                      />
                      <Select
                        value={filterType}
                        label="Tipo de feriado"
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <MenuItem value="">Todos</MenuItem>
                        {holidayTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button onClick={() => { setFilterMonth(""); setFilterType(""); }}>
                        Limpar Filtros
                      </Button>
                    </Box>

                    {filteredHolidays.length === 0 ? (
                      <Typography>Nenhum feriado encontrado para essa busca.</Typography>
                    ) : (
                      filteredHolidays.map((holiday, index) => (
                        <HolidayCard
                          key={holiday.date}
                          holiday={holiday}
                          total={selectedHolidays.length}
                          index={index + 1}
                        />
                      ))
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container{
  display: block;
  margin-top: 7em;
}
  .filters {
    margin-bottom: 3em;
  }`
import { useState, useContext, useEffect } from "react";
import { HolidayContext } from "../contexts/HolidayContext";
import { TextField, Autocomplete, CircularProgress, Avatar } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UserMenu from "./UserMenu";
import SearchHistory from "./SearchHistory";
import dayjs from "dayjs";
import styled from 'styled-components';


export default function SearchForm() {
    const { dispatch } = useContext(HolidayContext);
    const [country, setCountry] = useState("");
    const [countriesList, setCountriesList] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [year, setYear] = useState(null);
    const [openHistory, setOpenHistory] = useState(false);


    //Carregar países disponíveis na API
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch("https://date.nager.at/api/v3/AvailableCountries");
                const data = await res.json();
                setCountriesList(data);
            } catch (err) {
                console.log("Erro ao buscar os paises", err);
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, []);

    //Evento de buscar
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!year || !country) {
            dispatch({ type: "FETCH_ERROR", payload: "Preencha todos os campos" });

            return;
        }

        dispatch({ type: "FETCH_START" });


        //Busca os feriados na API do pais e ano
        try {

            if (year < 1975 || year > 2075) {
                dispatch({ type: "FETCH_ERROR", payload: " Insira uma data entre 1975 e 2075" });
                return;
            }

            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);


            if (!res.ok) {
                dispatch({ type: "FETCH_ERROR", payload: "Erro ao consultar API" });
                return;
            }

            const data = await res.json();
            dispatch({ type: "SET_API_HOLIDAYS", payload: data });


            console.log("Adicionando ao historico:", { year, country });
            dispatch({ type: "ADD_HISTORY", payload: { year, country } });


        }
        catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: err.message });
        }


    };


    return (
        <StyledWrapper>
            <div className="navbar">
                <form className="navbar-form" onSubmit={handleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            views={['year']}
                            label="Ano"
                            value={year ? dayjs().year(year) : null}
                            onChange={(newValue) => setYear(newValue.year())}
                            minDate={dayjs('1975-01-01')}
                            maxDate={dayjs('2075-12-31')}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

                    <Autocomplete
                        options={countriesList}
                        loading={loadingCountries}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => setCountry(newValue?.countryCode || "")}
                        sx={{ minWidth: 200, maxWidth: 200 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="País"
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingCountries ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <Avatar
                                    src={`https://flagcdn.com/w40/${option.countryCode.toLowerCase()}.png`}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                />
                                {option.name} ({option.countryCode})
                            </li>
                        )}
                    />

                    <button class="button_effect" type="submit">
                        <div class="svg-wrapper-1">
                            <div class="svg-wrapper">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="30"
                                    height="30"
                                    class="icon"
                                >
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />

                                </svg>
                            </div>
                        </div>
                        <span>Pesquisar</span>
                    </button>
                </form>
                <div className="history-wrapper">
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem", marginRight: "2rem" }}>
                        <UserMenu onOpenHistory={() => setOpenHistory(true)} />
                        <SearchHistory open={openHistory} onClose={() => setOpenHistory(false)} />
                    </div>
            </div>

        </div>
        </StyledWrapper >

    );
}

const StyledWrapper = styled.div`
            .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background-color:rgb(255, 255, 255);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 1rem 0rem;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
}

            .navbar-form {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
            padding: 0 3rem;
            width: 100%;
}

            .history-wrapper {
            margin-left: auto;
            margin-right: 2rem;
 }

            .navbar-form .MuiButton-root {
                height: 40px;
}


            .button_effect {
                font - family: inherit;
            font-size: 20px;
            background: #00c9ff;
            color: white;
            fill: rgb(255, 255, 255);
            padding: 0.7em 1em;
            padding-left: 0.9em;
            display: flex;
            align-items: center;
            cursor: pointer;
            border: none;
            border-radius: 15px;
            font-weight: 1000;
  }

            .button_effect span {
                display: block;
            margin-left: 0.5em;
            transition: all 0.3s ease-in-out;
  }

            .button_effect svg {
                display: block;
            transform-origin: center center;
            transition: transform 0.3s ease-in-out;
  }

            .button_effect:hover {
            transition: transform 0.3s ease-in-out;
                background: #00c9ff;
  }

            .button_effect:hover .svg-wrapper {
                transform: scale(1.5);
            transition: 0.5s linear;
  }

            .button_effect:hover svg {
                transform: translateX(2em) scale(1.1);
            fill: #fff;
  }

            .button_effect:hover span {
                opacity: 0;
            transition: 0.5s linear;
  }

            .button_effect:active {
                transform: scale(0.95);
  }`;


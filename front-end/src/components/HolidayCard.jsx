import { Typography, Box } from "@mui/material";
import { holidayTypeIcons } from "../utils/holidayTypeIcons";
import styled from 'styled-components';


const formatDate = (isoDateStr) => {
  const [year, month, day] = isoDateStr.split('T')[0].split('-');
  const paddedMonth = String(month).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');
  return `${year} ${paddedDay}/${paddedMonth}`;
};



export default function HolidayCard({ holiday, total, index }) {
  const { localName, name, date, types } = holiday
  return (
    <StyledWrapper style={{ "--length": total, "--i": index }} date={formatDate(date)}>
      <li data-date={date}>
        <h3>{localName}</h3>
        <p>{name}</p>

        <div className="holidayIcons-container">
          <Box className="holidayIcons">
            {Array.isArray(types) ? (
              types.map((type) => {
                const { icon, label } = holidayTypeIcons[type];
                return (
                  <Box key={type} className="holidayIconWrapper">
                    <Typography variant="caption">{label}</Typography>
                    <Box className="holidayIcon">{icon}</Box>
                  </Box>
                );
              })
            ) : types ? (
              (() => {
                const { icon, label } = holidayTypeIcons[types];
                return (
                  <Box className="holidayIconWrapper">
                    <Typography variant="caption">{label}</Typography>
                    <Box className="holidayIcon">{icon}</Box>
                  </Box>
                );
              })()
            ) : (
              (() => {
                const { icon } = holidayTypeIcons.Default;
                return (
                  <Box className="holidayIconWrapper">
                    <Typography variant="caption">Sem tipo</Typography>
                    <Box className="holidayIcon">{icon}</Box>
                  </Box>
                );
              })()
            )}
          </Box>
        </div>


      </li>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  li {
    --stop: calc(100% / var(--length) * var(--i));
	--l: 62%;
	--l2: 88%;
	--h: calc((var(--i) - 1) * (180 / var(--length)));
	--c1: hsl(var(--h), 71%, var(--l));
	--c2: hsl(var(--h), 71%, var(--l2));

    list-style: none;
    position: relative;
    max-width: 45rem;
    margin: 2rem auto;
    padding: 2rem 1rem 1rem;
    box-shadow: 0.1rem 0.1rem 1.5rem rgba(0, 0, 0, 0.3);
    border-radius: 0.25rem;
    overflow: hidden;
    background-color: white;
  }

  li::before {
    list-style: none;
    content: '';
    display: block;
    width: 100%;
    height: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to right, var(--c1) var(--stop), var(--c2) var(--stop));
  }

  h3 {
    display: flex;
    align-items: baseline;
    margin: 0 0 1rem;
    color: rgb(70 70 70);
    position: relative;
  }

  h3::before {
    content: "${(props) => props.date}";
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
    padding: 1rem;
    border-radius: 50%;
    background-color: var(--c1);
    color: white;
    
  }

  

  p {
    margin: 0;
    line-height: 1.6;
  }

  .holidayIcons-container {
    margin-top: 1rem;
  }

  .holidayIcons{
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
  }

  .holidayIconWrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
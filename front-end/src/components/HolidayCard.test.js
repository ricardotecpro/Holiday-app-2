import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HolidayCard from './HolidayCard';

// Agrupa os testes relacionados ao componente HolidayCard
describe('HolidayCard', () => {
  // Define um objeto de feriado mock para ser usado nos testes
  const mockHoliday = {
    localName: 'Ano Novo',
    name: 'New Year\'s Day',
    date: '2024-01-01T00:00:00.000Z',
    types: ['Public'],
  };

  // Teste específico: verifica se o componente renderiza os nomes do feriado
  test('renders holiday names correctly', () => {
    // 1. Renderiza o componente HolidayCard com os dados mockados
    render(<HolidayCard holiday={mockHoliday} total={1} index={1} />);

    // 2. Procura por elementos na tela que contenham os textos esperados
    const localNameElement = screen.getByText(/Ano Novo/i);
    const nameElement = screen.getByText(/New Year's Day/i);

    // 3. Afirma (assert) que os elementos foram encontrados no documento
    expect(localNameElement).toBeInTheDocument();
    expect(nameElement).toBeInTheDocument();
  });
});

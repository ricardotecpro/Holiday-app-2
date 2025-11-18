import { render } from '@testing-library/react';
import App from './App';

test('renders the main app component without crashing', () => {
  render(<App />);
});

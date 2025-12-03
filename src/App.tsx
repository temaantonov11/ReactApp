import { Route, Routes } from 'react-router-dom';
import Pokemons from './pages/pokemons';
import Movie from './pages/movie';
import Money from './pages/money';
import Weather from './pages/weather';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Pokemons />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/money" element={<Money />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </>
  );
}

export default App

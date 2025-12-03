import { Link, Route, Routes } from 'react-router-dom'
import Pokemons from './pages/pokemons'
import Movie from './pages/movie'
import Money from './pages/money'
import Weather from './pages/weather'

function App() {

  return (
    <>
      <nav style={{display: "flex", gap: 20}}>
        <Link to="/"> Pokemons </Link>
        <Link to="/movie"> Movie </Link>
        <Link to="/money"> Money </Link>
        <Link to="/weather"> Weather </Link>
      </nav>

      <hr />

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

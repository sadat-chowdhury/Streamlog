import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <Footer />
    </MovieProvider>
  );
}

export default App;

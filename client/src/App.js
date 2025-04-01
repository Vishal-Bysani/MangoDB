import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Movie from "./pages/Movie";
import Artist from "./pages/Artist";
import NotFound from "./pages/Notfound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/movie/:movieId" element={<Movie />} />
      <Route path="/artist" element={<Artist />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
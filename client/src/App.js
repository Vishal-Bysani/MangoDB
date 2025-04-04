import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Item from "./pages/Item";
import ItemReviews from "./pages/ItemReviews";
import Person from "./pages/Person";
import NotFound from "./pages/Notfound";
import Tag from "./pages/Tag"
import ListPersons from "./pages/ListPersons";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/item/:itemId" element={<Item />} />
      <Route path="/item/:itemId/reviews" element={<ItemReviews />} />
      <Route path="/person/:personId" element={<Person />} />
      <Route path="/tag/:tagId" element={<Tag />} />
      <Route path="/items/:itemId/list-persons/:role/" element={<ListPersons />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
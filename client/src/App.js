import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Item from "./pages/Item";
import ItemReviews from "./pages/ItemReviews";
import Person from "./pages/Person";
import NotFound from "./pages/NotFound";
import ListPersons from "./pages/ListPersons";
import Genre from "./pages/Genre";
import Search from "./pages/Search";
import ListProfileOverview from "./pages/ListProfileOverview";
import ItemSeasons from "./pages/ItemSeasons";
import Collection from "./pages/Collection";
import Book from "./pages/Book"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/item/:itemId" element={<Item />} />
      <Route path="/book/:bookId" element={<Book />} />
      <Route path="/book/:bookId/reviews" element={<ItemReviews />} />
      <Route path="/item/:itemId/reviews" element={<ItemReviews />} />
      <Route path="/item/:itemId/seasons" element={<ItemSeasons />} />
      <Route path="/person/:personId" element={<Person />} />
      <Route path="/items/:itemId/list-persons/:role/" element={<ListPersons />} />
      <Route path="/genre/:genreId" element={<Genre />} />
      <Route path="/collection/:collectionId" element={<Collection />} />
      <Route path="/search/:query" element={<Search />} />
      <Route path="/profile/:username/followers" element={<ListProfileOverview title="Followers" />} />
      <Route path="/profile/:username/following" element={<ListProfileOverview title="Following" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
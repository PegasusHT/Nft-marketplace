// Packages
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../layouts/home/Home";
import Create from "../layouts/create/Create";
import Profile from "../layouts/profile/Profile";
import Navigation from "./navigation/Navigation";
import Details from "../layouts/details/Details";
import Favorites from "../layouts/favorite/Favorites";
import Dashboard from "../layouts/dashboard/Dashboard";

// Initial entry point for application
export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nft/:id" element={<Details />} />
        <Route path="/favourites" element={<Favorites />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
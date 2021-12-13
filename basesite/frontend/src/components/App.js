import Home from "../layouts/home/Home";
import CreateItem from "./CreateItem";
import MyAsset from "./MyAsset";
import Navigation from "./navigation/Navigation";
import Details from "../layouts/details/Details";
import Favorites from "../layouts/favorite/Favorites";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

export default function App() {
    return (
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/create" element={<CreateItem/>} />
          <Route path="/myasset" element={<MyAsset/>} />
          <Route path="/nft/:id" element={<Details/>} />
          <Route path="/favorite" element={<Favorites/>} />
        </Routes>
      </BrowserRouter>
    );
}
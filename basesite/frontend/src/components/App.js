import Home from "../layouts/home/Home";
import CreateItem from "./CreateItem";
import MyAsset from "./MyAsset";
import Navigation from "./navigation/Navigation";
import Details from "../layouts/details/Details";

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
        </Routes>
      </BrowserRouter>
    );
}
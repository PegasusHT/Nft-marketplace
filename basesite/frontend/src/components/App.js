import Home from "../layouts/home/Home";
import CreateItem from "./CreateItem";
import MyAsset from "./MyAsset";
import Navigation from "./navigation/Navigation";


import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import TransactionsHistory from "./TransactionsHistory";

export default function App() {
    return (
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/create" element={<CreateItem/>} />
          <Route path="/myasset" element={<MyAsset/>} />
            <Route path="/transactionshistory" element={<TransactionsHistory/>} />
        </Routes>
      </BrowserRouter>
    );
}
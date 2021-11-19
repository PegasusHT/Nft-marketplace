import React, { Component } from "react";
import { render } from "react-dom";
import Home from "./Home";
import CreateItem from "./CreateItem";
import MyAsset from "./MyAsset";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/create" element={<CreateItem/>} />
          <Route path="/myasset" element={<MyAsset/>} />
        </Routes>
      </BrowserRouter>
    );
  }
}
const appDiv = document.getElementById("app");
render(<App />, appDiv);
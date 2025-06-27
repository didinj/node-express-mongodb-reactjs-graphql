import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Show from "./components/Show";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/show/:id" element={<Show />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import Calendar from "./components/Calender";
import Navbar from "./components/Navbar";
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <div className=" ">
      
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

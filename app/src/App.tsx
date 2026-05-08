import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "./providers";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import MyBids from "./pages/MyBids";
import "./index.css";

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-bids" element={<MyBids />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;

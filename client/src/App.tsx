import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { Projects } from "./pages/Projects";
import { About } from "./pages/About";

function App() {
    return (
        <main className="app-shell">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </main>
    );
}

export default App;

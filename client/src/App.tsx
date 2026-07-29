import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";

function App() {
    return (
        <main className="app-shell">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </main>
    );
}

export default App;

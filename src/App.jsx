import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Admin from './pages/Admin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}

export default App;

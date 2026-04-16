import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { LogPage } from './pages/LogPage.jsx';
import { Heart, BarChart3 } from 'lucide-react';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        {/* Navigation */}
        <nav className="glass sticky top-0 z-50 border-b border-gray-700/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-blue-400 transition-colors">
              <Heart className="w-6 h-6 text-red-500" />
              <span>BP Tracker</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:glass transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
              <Link 
                to="/log" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
              >
                <Heart className="w-5 h-5" />
                Log Reading
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

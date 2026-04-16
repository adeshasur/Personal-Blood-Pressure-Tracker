import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { LogPage } from './pages/LogPage.jsx';
import { Heart, BarChart3 } from 'lucide-react';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-xl font-black hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BP Tracker</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 underline-offset-8"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                to="/log" 
                className="btn-primary flex items-center gap-2 !px-5 !py-2.5 !text-sm"
              >
                <Heart className="w-4 h-4 fill-current" />
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

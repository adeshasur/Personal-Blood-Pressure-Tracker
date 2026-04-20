import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage }   from './pages/HomePage.jsx';
import { LogPage }    from './pages/LogPage.jsx';
import { ReportPage } from './pages/ReportPage.jsx';
import { Heart, Home, FileText, Plus } from 'lucide-react';
import './index.css';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
        isActive
          ? 'text-white bg-[#111111]'
          : 'text-[#666666] hover:text-[#111111] hover:bg-[#FAFAFA]'
      }`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
        {/* Minimal Navigation */}
        <nav className="flex-shrink-0 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F1F1F1]">
          <div className="w-full px-4 sm:px-8 md:px-12 py-3 sm:py-4 flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="p-1.5 sm:p-2 bg-[#111111] text-white rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>
              <span className="hidden sm:block font-bold text-lg sm:text-xl tracking-tight text-[#111111]">BP Tracker</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 p-1 bg-[#FAFAFA] rounded-full border border-[#F1F1F1]">
              <NavLink to="/">
                <Home className="w-4 h-4" />
                <span className="hidden sm:block">Dashboard</span>
              </NavLink>
              <NavLink to="/report">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:block">Report</span>
              </NavLink>
            </div>

            {/* Log Action */}
            <Link 
              to="/log" 
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#111111] text-white rounded-full font-bold text-xs sm:text-sm hover:bg-[#333333] transition-all duration-300 active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:block">Log</span>
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto page-transition">
          <Routes>
            <Route path="/"       element={<HomePage />}   />
            <Route path="/log"    element={<LogPage />}    />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

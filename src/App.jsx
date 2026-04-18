import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage }   from './pages/HomePage.jsx';
import { LogPage }    from './pages/LogPage.jsx';
import { ReportPage } from './pages/ReportPage.jsx';
import { Heart, BarChart3, FileText, PlusCircle } from 'lucide-react';
import './index.css';

const NavLink = ({ to, children, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-300 ${
        isActive
          ? 'text-white bg-white/10 border border-white/20'
          : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
      } ${className}`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-xl font-black hover:opacity-80 transition-opacity">
              <div className="p-2 bg-white text-black">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-white tracking-tighter">BP TRACKER</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              <NavLink to="/">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink to="/report">
                <FileText className="w-4 h-4" />
                Report
              </NavLink>
              <NavLink to="/log" className="!border-white/20 !text-white !bg-white/5 hover:!bg-white hover:!text-black ml-2">
                <PlusCircle className="w-4 h-4" />
                Log Reading
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/"       element={<HomePage />}   />
          <Route path="/log"    element={<LogPage />}    />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

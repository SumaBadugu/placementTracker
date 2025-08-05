import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminDashboard from "./AdminDashboard";
import CompanySelection from "./CompanySelection";
import CampusSelection from "./CampusSelection";
import OfCompanySelection from "./ofCompanySelection";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/company-selection" element={<CompanySelection />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/campus-selection" element={<CampusSelection />} />
        <Route path="/ofcompany-selection" element={<OfCompanySelection />} />
      </Routes>
    </Router>
  );
}

export default App;

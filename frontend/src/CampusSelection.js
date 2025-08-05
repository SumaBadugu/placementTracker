import React from "react";
import "./CampusSelection.css";
import { useNavigate, useLocation } from "react-router-dom";

const CampusSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    // Check if the user is a student or admin based on navigation state
    const isStudent = location.state?.role === "student";
    const isAdmin = location.state?.role === "admin";

    // Handle navigation to CompanySelection or AdminDashboard
    const handleNavigation = (type) => {
        if (isStudent) {
            const path = type === "On Campus" ? "/company-selection" : "/ofCompany-selection";
            navigate(path, { state: { campusType: type } });
        } else if (isAdmin) {
            navigate("/admin-dashboard", { state: { campusType: type } }); // Retaining the previous state
        }
    };
    
  
    return (
        <div className="container">
            <button className="campus-button on-campus" onClick={() => handleNavigation("On Campus")}>
                On Campus
            </button>
            <button className="campus-button off-campus" onClick={() => handleNavigation("Off Campus")}>
                Off Campus
            </button>
        </div>
    );
};

export default CampusSelection;


import React, { useState, useEffect } from "react";

import "./AdminDashboard.css"; // Assuming you have a CSS file for styling

const AdminDashboard = () => {
  useEffect(() => {
    fetch("http://localhost:5000/api/companies")
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error("Error fetching companies", err));
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", rounds: "" });
  const [selectedCompany, setSelectedCompany] = useState("");
  const [notification, setNotification] = useState({ message: "", visible: false });
  const [showDetailsPopup, setShowDetailsPopup] = useState({ visible: false, company: null });
  const [filterRounds, setFilterRounds] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("");

  const [companies, setCompanies] = useState([]);
const [branchCount, setBranchCount] = useState(null);

console.log(companies);


//   const handleShowBranchDetails = (e, companyName) => {
//   const branch = e.target.value;
//   setSelectedBranch(branch);
//   fetch(`http://localhost:5000/api/branchPassedCount?branch=${branch}&company=${companyName}`)
//     .then(res => res.json())
//     .then(data => {
//       setBranchCount(data.count);
//     });
// };

const [branchCounts, setBranchCounts] = useState({}); // Key: company name, Value: count

const handleShowBranchDetails = (e, companyName) => {
  const branch = e.target.value;

  fetch(`http://localhost:5000/api/branchPassedCount?branch=${branch}&company=${companyName}`)
    .then(res => res.json())
    .then(data => {
      setBranchCounts(prev => ({
        ...prev,
        [companyName]: {
          branch,
          count: data.count
        }
      }));
    });
};


  const handleShowDetails = (company) => {
    fetch(`http://localhost:5000/api/passedStudents/${company.cname}`)
      .then(res => res.json())
      .then(data => {
        setShowDetailsPopup({ visible: true, company: company.cname, students: data });
      });
  };


  const handleAddCompany = () => {
  if (newCompany.name && newCompany.rounds) {
    // API call to backend
    fetch("http://localhost:5000/api/addCompany", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cname: newCompany.name,
        trounds: Number(newCompany.rounds)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Refresh company list from DB
          fetch("http://localhost:5000/api/companies")
            .then(res => res.json())
            .then(data => setCompanies(data));

          setNewCompany({ name: "", rounds: "" });
          setNotification({ message: "Company Added Successfully!", visible: true });
          setTimeout(() => setNotification({ message: "", visible: false }), 3000);
        }
      })
      .catch(err => {
        console.error("Error adding company:", err);
      });
  }
};


  const handleRemoveCompany = () => {
  if (!selectedCompany || selectedCompany === "Select Company") return;

  fetch(`http://localhost:5000/api/deleteCompany/${selectedCompany}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Refresh the company list from DB
        fetch("http://localhost:5000/api/companies")
          .then(res => res.json())
          .then(data => setCompanies(data));

        setSelectedCompany("");
        setNotification({ message: "Company Removed Successfully!", visible: true });
        setTimeout(() => setNotification({ message: "", visible: false }), 3000);
      }
    })
    .catch(err => {
      console.error("Error deleting company:", err);
    });
};


  return (
    <div className="admin-dashboard">
      <h2 className="header">Admin Dashboard</h2>
      <button className="edit-btn" onClick={() => setShowModal(true)}>Edit</button>
      {/* <div className="filter-section">
        <label>Filter by Rounds:</label>
        <select onChange={(e) => setFilterRounds(e.target.value)}>
          <option>All</option>
          {[...new Set(companies.map((c) => c.rounds))].map((round, index) => (
            <option key={index} value={round}>{round}</option>
          ))}
        </select>
      </div> */}

      {notification.visible && <div className="popup-message">{notification.message}</div>}

      {showDetailsPopup.visible && showDetailsPopup.company && (
        <div className="show-details-modal">
          <div className="show-details-content">
            <span className="close-btn" onClick={() => setShowDetailsPopup({ visible: false, company: null })}>
              &times;
            </span>
            <h3>{showDetailsPopup.company.name} - Passed Students Details</h3>
            <ul>
              {showDetailsPopup.students?.length > 0 ? (
                showDetailsPopup.students.map((s, i) => (
                  <li key={i}>{s.stname} ({s.srno}) - {s.branch}</li>
                ))
              ) : (
                <li>No students passed all rounds yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      

      <table className="company-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Total Rounds</th>
            {/* <th>Passed Students Count</th> */}
            <th>Show Details</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {companies.filter(company => filterRounds === "All" || company.rounds === Number(filterRounds)).map((company, index) => (
            <tr key={index}>
              <td>{company.cname}</td>
              <td>{company.trounds}</td>
              {/* <td>{company.passed}</td> */}
              <td>
                <button className="show-btn" onClick={() => handleShowDetails(company)}>Show</button>
              </td>
              

              <td>
  <select onChange={(e) => handleShowBranchDetails(e, company.cname)}>
    <option value="Select">Select</option>
    <option value="CSE">CSE</option>
    <option value="IT">IT</option>
    <option value="AI&DS">AI&DS</option>
    <option value="AI&ML">AI&ML</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
    <option value="Civil">Civil</option>
    <option value="Mech">Mech</option>
  </select>

  <p>
    {
      branchCounts[company.cname]
        ? `Count (${branchCounts[company.cname].branch}): ${branchCounts[company.cname].count}`
        : ""
    }
  </p>
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Companies</h3>
            <div>
              <h4>Add Company</h4>
              <input type="text" placeholder="Company Name" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} />
              <input type="number" placeholder="Total Rounds" value={newCompany.rounds} onChange={(e) => setNewCompany({ ...newCompany, rounds: e.target.value })} />
              <button onClick={handleAddCompany}>Add Company</button>
            </div>
            <div>
              <h4>Remove Company</h4>
              <select onChange={(e) => setSelectedCompany(e.target.value)}>
                <option>Select Company</option>
                {companies.map((c, index) => (
                  <option key={index} value={c.cname}>{c.cname}</option>
                ))}
              </select>
              <button onClick={handleRemoveCompany}>Remove</button>
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

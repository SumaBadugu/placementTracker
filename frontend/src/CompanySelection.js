import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./CompanySelection.css";

const CompanySelection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [companies, setCompanies] = useState([]);
  const [onCampusCompanies, setOnCampusCompanies] = useState([]);
  const [blog, setBlog] = useState(""); // Store fetched blog content
  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
    branch: "CSE",
    company: "",
    roundsCleared: "0",
    placementBlog: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/companies")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, []);

  const fetchOnCampusCompanies = () => {
    axios
      .get("http://localhost:5000/api/companies")
      .then((response) => {
        setOnCampusCompanies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  };

  const fetchBlog = (companyName) => {
    console.log(`Fetching blog for: ${companyName}`);
    axios
  .get(`http://localhost:5000/api/blogs/${companyName}`) // Ensure this matches backend route
  .then((response) => {
    setBlog(response.data.content);
    console.log("Blog Data:", response.data);
    Swal.fire({
      title: `Blog - ${companyName}`,
      text: response.data.content || "No blog available.",
      icon: "info",
    });
  })
  .catch((error) => {
    console.error("Error fetching Blog:", error);
    Swal.fire("Error", error.response?.data?.error || "No blogs were posted till now", "error");
  });

  };
  
  const showModal = (companyName) => {
    setModalTitle(companyName);
    setFormData((prev) => ({ ...prev, company: companyName }));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const saveDetails = (event) => {
    event.preventDefault();
    const { name, regNumber, branch, company, placementBlog } = formData;
    if (!name || !regNumber || !branch || !company || !placementBlog) {
      Swal.fire("Error!", "Please fill out all required fields.", "error");
      return;
    }
    axios
      .post("http://localhost:5000/saveStudentProgress", formData)
      .then(() => {
        Swal.fire("Success!", "Your details have been saved.", "success");
        closeModal();
      })
      .catch((error) => {
        Swal.fire("Error!", "Failed to save data.", "error");
        console.error("Error saving details:", error);
      });
  };

  return (
    <div className="company-selection-container">
      <div className="header">
        <h1>Company Selection</h1>
        <p>Select a company to proceed</p>
      </div>

      <button className="oncampus-btn" onClick={fetchOnCampusCompanies}>
        On-Campus Companies
      </button>

      {onCampusCompanies.length > 0 && (
        <div className="table-container">
          <h2>On-Campus Companies</h2>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Enter</th>
                <th>Blog</th>
              </tr>
            </thead>
            <tbody>
              {onCampusCompanies.map((company) => (
                <tr key={company.cname}>
                  <td>{company.cname}</td>
                  <td>
                    <button className="enter-btn" onClick={() => showModal(company.cname)}>
                      Enter
                    </button>
                  </td>
                  <td>
                    <button className="blog-btn" onClick={() => fetchBlog(company.cname)}>
                      View Blog
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>{modalTitle}</h2>
            <form onSubmit={saveDetails}>
              <label>Name</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} required />
              <label>Registration Number</label>
              <input type="text" id="regNumber" value={formData.regNumber} onChange={handleChange} required />
              <label>Branch</label>
              <select id="branch" value={formData.branch} onChange={handleChange} required>
                {["CSE", "CS", "IT", "AI&DS", "AI&ML", "ECE", "EEE", "Civil", "Mech"].map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <label>Company</label>
              <select id="company" value={formData.company} onChange={handleChange} required>
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.cname} value={company.cname}>
                    {company.cname}
                  </option>
                ))}
              </select>
              <label>Rounds Cleared</label>
              <select id="roundsCleared" value={formData.roundsCleared} onChange={handleChange}>
                {["0", "1", "2", "3", "4", "6", "7", "8"].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <label>Placement Blog</label>
              <textarea id="placementBlog" value={formData.placementBlog} onChange={handleChange} required></textarea>
              <button type="submit" className="save-btn">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelection;

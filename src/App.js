import React, { useState, useEffect } from "react";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import "./App.css";
import Snackbar from "./components/Snackbar";

const apiUrl =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const itemsPerPage = 10;

const App = () => {
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setUsersData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // const handlePaginationClick = (page) => {
  //   setCurrentPage(
  //     Math.min(
  //       Math.max(page, 1),
  //       Math.ceil(filteredUsers.length / itemsPerPage)
  //     )
  //   );
  // };
  const handlePaginationClick = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (selectedUserIds) => {
    let type = selectedUserIds.length > 0 ? "success" : "error";

    setUsersData((prevUsersData) =>
      prevUsersData.filter((user) => !selectedUserIds.includes(user.id))
    );
    if (selectedUserIds.length > 0) {
      setSnackbarMessage({
        message: "Selected user deleted successfully",
        type
      });
    } else {
      setSnackbarMessage({ message: "No users selected for deletion", type });
    }
  };

  const handleEdit = (userId, newName, newEmail, newRole) => {
    setUsersData((prevUsersData) =>
      prevUsersData.map((user) =>
        user.id === userId
          ? { ...user, name: newName, email: newEmail, role: newRole }
          : user
      )
    );
  };

  const filteredUsers = usersData.filter(
    (user) =>
      user.id.includes(searchQuery) ||
      user.name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery) ||
      user.role.toLowerCase().includes(searchQuery)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const handleSnackbarClose = () => {
    setSnackbarMessage("");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin UI</h1>
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <UserTable
        data={currentItems}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSnackbarMessage={setSnackbarMessage}
      />
      <Pagination
        totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
        currentPage={currentPage}
        onPageChange={handlePaginationClick}
      />
      {snackbarMessage && (
        <Snackbar
          message={snackbarMessage.message}
          type={snackbarMessage.type}
          onClose={handleSnackbarClose}
        />
      )}
    </div>
  );
};

export default App;

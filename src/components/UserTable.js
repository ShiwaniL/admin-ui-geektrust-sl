import React, { useState } from "react";
import Snackbar from "./Snackbar";
import { FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";

const UserTable = ({ data, handleEdit, handleDelete }) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEditClick = (userId, name, email, role) => {
    setEditingUserId(userId);
    setEditedName(name);
    setEditedEmail(email);
    setEditedRole(role);
  };

  const handleSaveClick = () => {
    // Validate editedName and editedRole
    const nameContainsLetters = /[a-zA-Z]{3,}/.test(editedName);
    const roleContainsLetters = /[a-zA-Z]{3,}/.test(editedRole);

    if (!nameContainsLetters) {
      setSnackbarMessage({
        message: "Name should contain at least 3 letters.",
        type: "error" // Set the type to "error" for validation errors
      });
      return;
    }

    if (!roleContainsLetters) {
      setSnackbarMessage({
        message: "Role should contain at least 3 letters.",
        type: "error" // Set the type to "error" for validation errors
      });
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editedEmail)) {
      setSnackbarMessage({
        message: "Please enter a valid email address.",
        type: "error" // Set the type to "error" for validation errors
      });
      return;
    }

    // If all validations pass, save the edits
    handleEdit(editingUserId, editedName, editedEmail, editedRole);
    setEditingUserId(null);
    setSnackbarMessage({
      message: "User edited successfully",
      type: "success" // Set the type to "success" for successful edit
    });
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
  };

  const handleCheckboxChange = (userId) => {
    const updatedSelectedUserIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter((id) => id !== userId)
      : [...selectedUserIds, userId];
    setSelectedUserIds(updatedSelectedUserIds);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allUserIds = data.map((user) => user.id);
    setSelectedUserIds(selectAll ? [] : allUserIds);
  };

  const handleDeleteSelected = () => {
    let type = selectedUserIds.length > 0 ? "success" : "error";

    if (selectedUserIds.length > 0) {
      handleDelete(selectedUserIds);
      setSelectedUserIds([]);
      setSelectAll(false); // Uncheck "Select All" after deletion
      setSnackbarMessage({
        message: "Selected user(s) deleted successfully",
        type
      });
    } else {
      setSnackbarMessage({ message: "No users selected for deletion", type });
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarMessage("");
  };

  return (
    <div>
      <table id="userTable">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  className="userCheckbox"
                  data-id={user.id}
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td id="action">
                {editingUserId === user.id ? (
                  <>
                    <FaSave className="edit-icon" onClick={handleSaveClick} />{" "}
                    {/* Save icon */}
                    <FaTimes
                      className="delete-icon"
                      onClick={handleCancelClick}
                    />{" "}
                    {/* Cancel icon */}
                  </>
                ) : (
                  <>
                    <FaEdit
                      className="edit-icon"
                      onClick={() =>
                        handleEditClick(
                          user.id,
                          user.name,
                          user.email,
                          user.role
                        )
                      }
                    />{" "}
                    {/* Edit icon */}
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => handleDelete(user.id)}
                    />{" "}
                    {/* Delete icon */}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button id="deleteSelectedBtn" onClick={handleDeleteSelected}>
        Delete Selected
      </button>
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

export default UserTable;

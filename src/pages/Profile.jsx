import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import SuccessModal from "../components/sucessModal";

const Profile = () => {
  const { user, login,logout } = useContext(UserContext);

  const [userData, setUserData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    profileImage: user?.profileImage
      ? `http://localhost:9090/profile-images/${user.profileImage}`
      : null,
  });

  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(userData.profileImage);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("fullName", userData.fullName);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
  
    if (userData.password) {
      formData.append("password", userData.password);
    }
  
    if (profilePicture instanceof File) {
      formData.append("file", profilePicture);
    }
  
    fetch("http://localhost:9090/user/updateProfile", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || "Failed to update profile.");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
        setEditing(false);
        setShowModal(true);
  
        // Update the UserContext with the new data
        const updatedUser = {
          ...user,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          profileImage: profilePicture instanceof File 
            ? URL.createObjectURL(profilePicture) 
            : user.profileImage,
        };
  
        login(updatedUser); // Update the context with the new user data
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert(error.message); // Display error message if needed
      });
  };
  
  

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center">
            <div className="w-44 h-44 rounded-full border-4 border-green-500 shadow-md overflow-hidden mx-auto mb-4">
              {profilePicture ? (
                <img
                  src={
                    profilePicture instanceof File
                      ? URL.createObjectURL(profilePicture)
                      : profilePicture
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
            </div>
            {editing && (
              <label
                htmlFor="profilePictureInput"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg cursor-pointer transition duration-300"
              >
                Change Profile Picture
                <input
                  type="file"
                  id="profilePictureInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            )}
          </div>

          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-green-700 mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information and account settings.
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <form className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              disabled={!editing}
              className={`mt-2 p-3 block w-full rounded-md border ${
                editing ? "border-gray-300" : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!editing}
              className={`mt-2 p-3 block w-full rounded-md border ${
                editing ? "border-gray-300" : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              disabled={!editing}
              className={`mt-2 p-3 block w-full rounded-md border ${
                editing ? "border-gray-300" : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              placeholder="Enter new password"
              onChange={handleChange}
              disabled={!editing}
              className={`mt-2 p-3 block w-full rounded-md border ${
                editing ? "border-gray-300" : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
        </form>

        <div className="flex justify-end mt-8 space-x-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 mt-4 rounded-lg shadow-lg transition duration-300"
        >
          Log Out
        </button>
      </div>

      {showModal && (
        <SuccessModal
          message="Your profile has been updated successfully!"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;

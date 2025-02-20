import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import SuccessModal from "../components/sucessModal";

const Profile = () => {
  const { user, login } = useContext(UserContext);

  const [userData, setUserData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    // Show full URL for display in the Profile page
    profileImage: user?.profileImage
      ? `http://localhost:9090/profile-images/${user.profileImage}`
      : null,
  });

  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(userData.profileImage);
  const [showModal, setShowModal] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  // Save profile changes and update the user in context and localStorage
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
          throw new Error("Profile update failed.");
        }
        return response.json();
      })
      .then((updatedUserFromServer) => {
        // Assume backend returns profileImage as filename, e.g. "1_newFile.jpg"
        const updatedProfileImage = updatedUserFromServer.profileImage || null;

        // Build updated user object to store (store only the filename)
        const updatedUser = {
          ...user,
          fullName: updatedUserFromServer.fullName,
          email: updatedUserFromServer.email,
          phone: updatedUserFromServer.phone,
          profileImage: updatedProfileImage,
        };

        // Update the global UserContext and localStorage
        login(updatedUser);
        setEditing(false);
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-white to-green-50 relative overflow-hidden">
      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[calc(200%+1.3px)] h-40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M985.66 16.63c-73.32 0-135.54 
               31.48-186.52 61.91-51 30.43-99.29 
               59.21-166.8 59.21-67.63 0-113.94-26.03
               -160.77-52.2-46.05-25.78-89.57-50.16
               -154.37-50.16-65.43 0-115.72 24.38
               -163.71 51.8-48.53 27.77-95.16 
               54.45-167.69 54.45V120H1200V0c-64.35 
               0-119.84 16.63-214.34 16.63z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2 drop-shadow-sm">
            Manage Your Profile
          </h1>
          <p className="text-gray-600">
            Update your personal details and settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            {/* Left: Profile Picture */}
            <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
              <div className="w-44 h-44 rounded-full border-4 border-green-500 shadow-md overflow-hidden mb-4 transform hover:scale-105 transition-transform duration-300">
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
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg cursor-pointer transition duration-300 hover:scale-105"
                >
                  Change Picture
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

            {/* Right: Form Fields */}
            <form className="w-full space-y-6 md:flex-1">
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
                  className={`mt-2 p-3 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-green-200 ${
                    editing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
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
                  className={`mt-2 p-3 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-green-200 ${
                    editing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
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
                  className={`mt-2 p-3 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-green-200 ${
                    editing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
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
                  placeholder="Enter new password"
                  value={userData.password}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`mt-2 p-3 block w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-green-200 ${
                    editing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
                  }`}
                />
              </div>
            </form>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-8 space-x-4">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300 hover:scale-105"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300 hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg transition duration-300 hover:scale-105"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-[calc(200%+1.3px)] h-40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M985.66 16.63c-73.32 0-135.54 
               31.48-186.52 61.91-51 30.43-99.29 
               59.21-166.8 59.21-67.63 0-113.94-26.03
               -160.77-52.2-46.05-25.78-89.57-50.16
               -154.37-50.16-65.43 0-115.72 24.38
               -163.71 51.8-48.53 27.77-95.16 
               54.45-167.69 54.45V120H1200V0c-64.35 
               0-119.84 16.63-214.34 16.63z"
            fill="#FFFFFF"
          />
        </svg>
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

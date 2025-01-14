import React, { useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    password: "",
    preferences: { newsletter: true, updates: false },
  });
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setUserData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [name]: checked },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setEditing(false);
    console.log("User data saved:", userData);
    // Add API call to save user data
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="w-44 h-44 rounded-full border-4 border-green-500 shadow-md overflow-hidden mx-auto mb-4">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  150 x 150
                </div>
              )}
            </div>
            <label
              htmlFor="profilePictureInput"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg cursor-pointer transition duration-300"
            >
              Change Profile Picture
            </label>
            <input
              type="file"
              id="profilePictureInput"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* Profile Header */}
          <div className="text-left">
            <h1 className="text-4xl font-extrabold text-green-700 mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information, account settings, and preferences.
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
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
                editing
                  ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
                editing
                  ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
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
                editing
                  ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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
              className={`mt-2 p-3 block w-full rounded-md border ${
                editing
                  ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  : "border-gray-200 bg-gray-100"
              }`}
            />
          </div>
        </form>

        {/* Buttons */}
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
      </div>
    </div>
  );
};

export default Profile;

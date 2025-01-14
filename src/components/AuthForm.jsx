import React from "react";

const AuthForm = ({ title, fields, actionText, actionLink, actionLinkText, onSubmit }) => {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full border border-green-400">
      <h2 className="text-2xl font-bold text-green-600 text-center">{title}</h2>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 font-semibold">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
              required={field.required || false}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition"
        >
          {actionText}
        </button>
      </form>
      <p className="mt-6 text-center">
        {actionLinkText}{" "}
        <a href={actionLink} className="text-green-600 hover:underline">
          {actionText === "Register" ? "Sign In" : "Sign Up"}
        </a>
      </p>
    </div>
  );
};

export default AuthForm;

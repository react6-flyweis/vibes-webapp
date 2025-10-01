/** @format */
import React, { useState } from "react";
import { UserPlus, Contact, Filter } from "lucide-react";

const GuestManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"guestList" | "invitations">(
    "guestList"
  );

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 max-w-6xl mx-auto mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Guests</h2>
          <p className="text-gray-500 text-sm mt-1">
            Add guests to your invitation list.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            <UserPlus size={18} />
            Invite Guests
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            <Contact size={18} />
            Sync Contacts
          </button>
        </div>
      </div>

      {/* Guest Management */}
      <div className="border-2 border-gray-300 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          Guest Management
        </h3>

        {/* Tabs */}
        <div className="flex w-64 bg-gray-100 rounded-md mb-6">
          <button
            onClick={() => setActiveTab("guestList")}
            className={`w-1/2 px-4 py-2 font-medium rounded-md ${
              activeTab === "guestList"
                ? "bg-white border-2 border-blue-600 text-blue-600"
                : "text-gray-400"
            }`}
          >
            Guest List
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`w-1/2 px-4 py-2 font-medium rounded-md ${
              activeTab === "invitations"
                ? "bg-white border-2 border-blue-600 text-blue-600"
                : "text-gray-400"
            }`}
          >
            Invitations
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search guests..."
              className="w-full p-2 outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 w-56 justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} />
              <span className="font-medium text-gray-800">All Status</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "guestList" ? (
          <p className="text-center text-gray-500 text-lg">
            No guests found matching your criteria.
          </p>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No invitations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GuestManagement;

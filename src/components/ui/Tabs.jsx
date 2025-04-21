// src/components/ui/Tabs.jsx
import React from "react";

export default Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex border-b">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`px-4 py-2 font-medium ${activeTab === tab
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-blue-500"
          }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

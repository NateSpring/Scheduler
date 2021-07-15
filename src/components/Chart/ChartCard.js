import React from "react";

function Chart({ children, title }) {
  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <p className="text-4xl font-bold text-gray-800 dark:text-gray-300">
        {title}
      </p>
      {children}
    </div>
  );
}

export default Chart;

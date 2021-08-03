import React from "react";

function Chart({ children, title, size }) {
  return (
    <div className="min-w-0 p-4 bg-white shadow-xs dark:bg-gray-800 border border-gray-400 m-2 rounded-lg shadow">
      <p className={`${size} font-bold text-gray-800 dark:text-gray-300}`}>
        {title}
      </p>
      {children}
    </div>
  );
}

export default Chart;

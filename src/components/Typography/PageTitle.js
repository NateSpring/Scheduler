import React from "react";

function PageTitle({ children }) {
  return (
    <h1 className="my-6 text-4xl font-bold text-gray-700 dark:text-gray-200">
      {children}
    </h1>
  );
}

export default PageTitle;

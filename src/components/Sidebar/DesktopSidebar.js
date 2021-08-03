import React from "react";

import SidebarContent from "./SidebarContent";

function DesktopSidebar(props) {
  return (
    <aside
      className="z-30 flex-shrink-0 hidden w-64 overflow-y-auto 
    bg-gray-700
    dark:bg-gray-800 lg:block"
    >
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    id: -1,
    path: "/app/scheduler", // the url
    icon: "TablesIcon", // the component being exported from icons/index.js
    name: "Scheduler", // name that appear in Sidebar
  },
  {
    id: 0,
    path: "/app/nesting", // the url
    icon: "TablesIcon", // the component being exported from icons/index.js
    name: "Nesting", // name that appear in Sidebar
    cap: 100,
  },

  {
    id: 1,
    path: "/app/laser",
    icon: "TablesIcon",
    name: "Laser",
    cap: 10,
  },
  {
    id: 2,
    path: "/app/pressbrake",
    icon: "TablesIcon",
    name: "Press Brake",
    cap: 20,
  },
  {
    id: 3,
    path: "/app/tubefab",
    icon: "TablesIcon",
    name: "Tube Laser",
    cap: 7,
  },
  {
    id: 4,
    path: "/app/tubebender",
    icon: "TablesIcon",
    name: "Tube Bender",
    cap: 3,
  },
  {
    id: 5,
    path: "/app/saw",
    icon: "TablesIcon",
    name: "Saw",
    cap: 6,
  },
  {
    id: 6,
    path: "/app/mill",
    icon: "TablesIcon",
    name: "Mill",
    cap: 10,
  },
  {
    id: 7,
    path: "/app/Lathe",
    icon: "TablesIcon",
    name: "Lathe",
    cap: 6,
  },

  {
    id: 8,
    path: "/app/welding",
    icon: "TablesIcon",
    name: "Welding",
    cap: 12,
    cap_toolbox: 10,
  },
  {
    id: 9,
    path: "/app/roboticwelding",
    icon: "TablesIcon",
    name: "Robotic Welding",
    cap: 14,
  },
  {
    id: 10,
    path: "/app/powdercoating",
    icon: "TablesIcon",
    name: "Powder Coating",
    cap: 20,
  },
  {
    id: 11,
    path: "/app/hardware",
    icon: "TablesIcon",
    name: "Hardware",
    cap: 20,
  },
  {
    id: 12,
    path: "/app/finalassembly",
    icon: "TablesIcon",
    name: "Final Assembly",
    cap: 16,
    cap_dolly: 8,
    cap_sp: 1,
  },
  {
    id: 13,
    path: "/app/Packaging",
    icon: "TablesIcon",
    name: "Packaging",
    cap: 12,
  },
  {
    id: 14,
    path: "/app/shipping",
    icon: "TablesIcon",
    name: "Shipping",
    cap: 20,
  },

  // {
  //   path: "/app/cards",
  //   icon: "CardsIcon",
  //   name: "Cards",
  // },
  // {
  //   path: "/app/charts",
  //   icon: "ChartsIcon",
  //   name: "Charts",
  // },
  // {
  //   path: "/app/buttons",
  //   icon: "ButtonsIcon",
  //   name: "Buttons",
  // },
  // {
  //   path: "/app/modals",
  //   icon: "ModalsIcon",
  //   name: "Modals",
  // },
  // {
  //   path: "/app/tables",
  //   icon: "TablesIcon",
  //   name: "Tables",
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Pages",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/login",
  //       name: "Login",
  //     },
  //     {
  //       path: "/create-account",
  //       name: "Create account",
  //     },
  //     {
  //       path: "/forgot-password",
  //       name: "Forgot password",
  //     },
  //     {
  //       path: "/app/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/app/blank",
  //       name: "Blank",
  //     },
  //   ],
  // },
];

export default routes;

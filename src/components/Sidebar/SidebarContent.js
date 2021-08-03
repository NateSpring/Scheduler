import React from "react";
import routes from "../../routes/sidebar";
import { NavLink, Route } from "react-router-dom";
// import * as Icons from "../../icons";
import SidebarSubmenu from "./SidebarSubmenu";
import { Button } from "@windmill/react-ui";

// function Icon({ icon, ...props }) {
//   const Icon = Icons[icon];
//   return <Icon {...props} />;
// }
import { FaBoxOpen, FaBox } from "react-icons/fa";
import { GiNestEggs } from "react-icons/gi";
import { GoDashboard } from "react-icons/go";
import { BsCalendar } from "react-icons/bs";
import {
  GiLaserWarning,
  GiStraightPipe,
  GiLeadPipe,
  GiCircularSawblade,
  GiNeedleDrill,
  GiFlintSpark,
  GiRobotGolem,
  GiPowder,
  GiHexagonalNut,
  GiPuzzle,
  GiWorld,
  GiLaserBlast,
  GiLaserburn,
} from "react-icons/gi";
import PressIcon from "../../icons/press.svg";
import LatheIcon from "../../icons/lathe.svg";
import SchedulerIcon from "../../icons/scheduler-icon.svg";

function SidebarContent() {
  let ReactIcons = {
    Dashboard: <GoDashboard className="text-3xl" />,
    Scheduler: <BsCalendar className="text-3xl" />,
    Nesting: <GiNestEggs className="text-3xl" />,
    Laser: <GiLaserburn className="text-3xl" />,
    "Press Brake": <img src={PressIcon} />,
    "Tube Laser": <GiStraightPipe className="text-3xl" />,
    "Tube Bender": <GiLeadPipe className="text-3xl" />,
    Saw: <GiCircularSawblade className="text-3xl" />,
    Mill: <GiNeedleDrill className="text-3xl" />,
    Lathe: <img src={LatheIcon} />,
    Welding: <GiFlintSpark className="text-3xl" />,
    "Robotic Welding": <GiRobotGolem className="text-3xl" />,
    "Powder Coating": <GiPowder className="text-3xl" />,
    Hardware: <GiHexagonalNut className="text-3xl" />,
    "Final Assembly": <GiPuzzle className="text-3xl" />,
    Packaging: <FaBoxOpen className="text-3xl" />,
    Shipping: <FaBox className="text-3xl" />,
  };

  return (
    <div className="py-4 text-gray-50 dark:text-gray-400">
      <a
        className="flex flex-col justify-center items-center border-b-4 border-gray-100 pb-4"
        href="/"
      >
        <img src={SchedulerIcon} height="125px" width="125px" />
        <p className="text-center text-2xl font-bold text-gray-50 dark:text-gray-200 uppercase italic">
          Scheduler
        </p>
      </a>
      <ul className="mt-6">
        <>
          {routes.map((route) =>
            route.routes ? (
              <SidebarSubmenu route={route} key={route.name} />
            ) : (
              <li className="relative m-1" key={route.name}>
                <NavLink
                  exact
                  to={route.path}
                  className="inline-flex items-center px-6 py-1 w-full text-lg font-semibold transition-colors duration-150 rounded-r-xl
                  transform hover:scale-101 hover:bg-blue-400 hover:rounded-r-xl dark:hover:text-gray-200 border-b-2 border-gray-600"
                  activeClassName="bg-blue-600
                  transform scale-101 rounded-r-xl text-white  hover:text-white hover:font-bold dark:text-gray-100"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="absolute inset-y-0 left-0 w-4 bg-blue-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  </Route>
                  {ReactIcons[route.name]}
                  <span className="ml-4">{route.name}</span>
                </NavLink>
              </li>
            )
          )}
        </>
        {/* Hard Coded Production Link to prevent being in route loop */}
        <li className="relative m-1" key="Production">
          <NavLink
            exact
            to="/app/production"
            className="inline-flex items-center px-6 py-1 w-full text-lg font-semibold transition-colors duration-150 hover:bg-blue-400 dark:hover:text-gray-200"
            activeClassName="bg-gradient-to-l
                  from-blue-400
                  to-blue-600
                  animate-gradient-xy-slow rounded-r-xl text-white  hover:text-white hover:font-bold dark:text-gray-100"
          >
            <Route path="/app/production">
              <span
                className="absolute inset-y-0 left-0 w-4 bg-blue-600 rounded-tr-lg rounded-br-lg"
                aria-hidden="true"
              ></span>
            </Route>
            <GiWorld className="text-3xl" />
            <span className="ml-4">Production</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SidebarContent;

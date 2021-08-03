import React, { useContext, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from "../icons";
import {
  Avatar,
  Badge,
  Input,
  Dropdown,
  DropdownItem,
  WindmillContext,
} from "@windmill/react-ui";
import { HopperContext } from "../context/HopperContext";

import Select from "react-select";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const { hopper } = useContext(HopperContext);

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  const whatDept = (currentDept) => {
    let decodedObj = {};
    let cd = currentDept;
    if (cd == -1) {
      decodedObj = {
        decoded_dept: "SCHEDULER",
        decoded_url: "/app/scheduler",
      };
    } else if (cd == 0) {
      decodedObj = {
        decoded_dept: "NESTING",
        decoded_url: "/app/nesting",
      };
    } else if (cd == 1) {
      decodedObj = {
        decoded_dept: "LASER",
        decoded_url: "/app/laser",
      };
    } else if (cd == 2) {
      decodedObj = {
        decoded_dept: "PRESSBRAKE",
        decoded_url: "/app/pressbrake",
      };
    } else if (cd == 3) {
      decodedObj = {
        decoded_dept: "TUBE LASER",
        decoded_url: "/app/tubefab",
      };
    } else if (cd == 4) {
      decodedObj = {
        decoded_dept: "TUBE BENDER",
        decoded_url: "/app/tubebender",
      };
    } else if (cd == 5) {
      decodedObj = {
        decoded_dept: "SAW",
        decoded_url: "/app/saw",
      };
    } else if (cd == 6) {
      decodedObj = {
        decoded_dept: "MILL",
        decoded_url: "/app/mill",
      };
    } else if (cd == 7) {
      decodedObj = {
        decoded_dept: "LATHE",
        decoded_url: "/app/lathe",
      };
    } else if (cd == 8) {
      decodedObj = {
        decoded_dept: "WELDING",
        decoded_url: "/app/welding",
      };
    } else if (cd == 9) {
      decodedObj = {
        decoded_dept: "ROBOT WELDING",
        decoded_url: "/app/roboticwelding",
      };
    } else if (cd == 10) {
      decodedObj = {
        decoded_dept: "POWDER",
        decoded_url: "/app/powdercoating",
      };
    } else if (cd == 11) {
      decodedObj = {
        decoded_dept: "HARDWARE",
        decoded_url: "/app/hardware",
      };
    } else if (cd == 12) {
      decodedObj = {
        decoded_dept: "FINAL ASSEM.",
        decoded_url: "/app/finalassembly",
      };
    } else if (cd == 13) {
      decodedObj = {
        decoded_dept: "PACKAGING",
        decoded_url: "/app/Packaging",
      };
    } else if (cd == 14) {
      decodedObj = {
        decoded_dept: "SHIPPING",
        decoded_url: "/app/shipping",
      };
    }
    return decodedObj;
  };
  const hopArray = [];

  hopper.map((hop) => {
    let hopDestruct = {
      label: `#${hop.sales_order}, ${hop.customer}, ${hop.part_number} is at ${
        whatDept(hop.current_dept).decoded_dept
      }`,
      value: `${whatDept(hop.current_dept).decoded_url}`,
    };
    if (hop.current_dept !== 100) {
      hopArray.push(hopDestruct);
    }
  });
  const [searchSelected, setSearchSelected] = useState();
  const onchange = (searchSelected) => {
    setSearchSelected(searchSelected);
    console.log("Search value:", searchSelected);
    window.location.href = `${searchSelected.value}`;
  };

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600 dark:text-blue-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-blue"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-blue-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Select
              className="text-md font-semibold "
              placeholder="Search Build Orders, Product Numbers..."
              options={hopArray}
              value={searchSelected}
              onChange={onchange}
            />
          </div>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-blue"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "light" ? (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          {/* <!-- Notifications menu --> */}
          <li className="relative hidden">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-blue"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              {/* <!-- Notification badge --> */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button>

            <Dropdown
              align="right"
              isOpen={isNotificationsMenuOpen}
              onClose={() => setIsNotificationsMenuOpen(false)}
            >
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Messages</span>
                <Badge type="danger">13</Badge>
              </DropdownItem>
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Sales</span>
                <Badge type="danger">2</Badge>
              </DropdownItem>
              <DropdownItem onClick={() => alert("Alerts!")}>
                <span>Alerts</span>
              </DropdownItem>
            </Dropdown>
          </li>
          {/* <!-- Profile menu --> */}
          <li className="relative hidden">
            <button
              className="rounded-full focus:shadow-outline-blue focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                alt=""
                aria-hidden="true"
              />
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem tag="a" href="#">
                <OutlinePersonIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Profile</span>
              </DropdownItem>
              <DropdownItem tag="a" href="#">
                <OutlineCogIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem onClick={() => alert("Log out!")}>
                <OutlineLogoutIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

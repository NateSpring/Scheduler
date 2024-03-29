import React, { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { HopperContext } from "../context/HopperContext";
import "react-toastify/dist/ReactToastify.css";

export const OpenPartsLibrarySettings = ({ build }) => {
  const { hopper, setHopper, cells, setCells } = useContext(HopperContext);

  const ToastMsg = (buildOrder, message) => (
    <div>
      <FontAwesomeIcon icon={faFolderOpen} />
      <p className="text-xl font-bold">{message}</p>
      <p className="font-semibold underline">
        *Look for Flashing File Explorer!
      </p>
    </div>
  );
  const ToastErr = (buildOrder, error) => (
    <div>
      <FontAwesomeIcon icon={faFolderOpen} />
      <p className="text-xl font-bold">Defect Report Failure!</p>
      <p className="font-semibold">Build Order:</p>
      <span>{buildOrder}</span>
      <p className="font-semibold">Error:</p>
      <span> {error}</span>
    </div>
  );

  const openPLFolder = async () => {
    if (window && window.process && window.process.type == "renderer") {
      window.open(build.part_number, build.part_data[1]);
    } else {
      console.log("Cannot open local folder from browser");
    }
  };
  return (
    <>
      <button
        className="flex flex-row justify-center align-center items-center p-2 w-8/12 bg-gray-200 hover:bg-gray-300 shadow hover:shadow-inner rounded"
        onClick={openPLFolder}
      >
        <FontAwesomeIcon
          icon={faFolderOpen}
          className={`mr-4 p-1 transform hover:rotate-360 hover:scale-150 transition-transform duration-1000 ease-out`}
          size="2x"
        />
        <h2 className="text-lg font-semibold">Open Parts Library Folder</h2>
      </button>
    </>
  );
};

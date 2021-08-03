import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
} from "@windmill/react-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faDumpsterFire,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { StatusColor } from "../utils";
import { BuildOrderPartFlow, PartFlow } from "../utils/partflow";
import { HopperContext } from "../context/HopperContext";
import "react-toastify/dist/ReactToastify.css";

export const InfoSettings = ({ build }) => {
  const { hopper, setHopper, cells, setCells } = useContext(HopperContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const taktStatus = {
    blue: "Waiting",
    red: "Behind",
    green: "On Time",
    orange: "Defect",
    hot: "HOT 🔥",
    recut: "Recut",
  };
  return (
    <>
      <button
        className="flex flex-row justify-center align-center items-center p-2 w-8/12 bg-gray-200 hover:bg-gray-300 shadow hover:shadow-inner rounded "
        onClick={() => {
          setInfoModalOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className={`mr-4 p-1 transform hover:rotate-360 hover:scale-150 transition-transform duration-1000 ease-out`}
          size="2x"
        />
        <h2 className="text-lg font-semibold">Build Information </h2>
      </button>

      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-blue-500 rounded-t-lg dark:bg-blue-700 sm:rounded-lg sm:m-4 sm:max-w-xl"
        isOpen={infoModalOpen === true}
        onClose={() => {
          setInfoModalOpen(false);
        }}
      >
        <ModalHeader className="flex flex-col items-center">
          <div className="text-gray-100">
            <FontAwesomeIcon className="p-0.5 mr-2" icon={faQuestionCircle} />
            Build Order Information
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-row justify-center items-center text-center bg-white rounded-lg p-2">
          <div className="flex flex-col justify-center  gap-4 p-4 w-12/12">
            <h2 className="text-xl font-semibold border-b-2 w-full">
              Part #: <span className="font-normal">{build.part_number}</span>
            </h2>
            <h2 className="text-xl font-semibold border-b-2 w-full">
              Customer: <span className="font-normal">{build.customer}</span>
            </h2>
            <h2 className="text-xl font-semibold border-b-2 w-full">
              Build ID: <span className="font-normal">{build.id}</span>
            </h2>
            <h2 className="text-xl font-semibold border-b-2 w-full">
              Sales Order #:
              <span className="font-normal">{build.sales_order}</span>
            </h2>
            <h2 className="text-xl font-semibold border-b-2 w-full">
              Part Qty: <span className="font-normal">{build.quantity}</span>
            </h2>
            <h2 className="text-xl font-semibold border-b-2 w-full">
              Current Cell:
              <span className="font-normal ml-2">{build.current_cell}</span>
            </h2>
            <h2 className="text-xl font-semibold border-b-2 w-full mb-2">
              Current Status:
              <span
                className={`px-3 mx-2 font-bold uppercase text-lg text-white ${
                  StatusColor(build.takt_status).light
                } rounded`}
              >
                {taktStatus[build.takt_status]}
              </span>
            </h2>

            <div className="flex flex-row justify-center flex-wrap gap-1 w-full h-50 ">
              <BuildOrderPartFlow buildData={build} />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="hidden sm:block">
            <Button
              layout="outline"
              onClick={() => {
                setInfoModalOpen(false);
              }}
            >
              Close
            </Button>
          </div>

          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

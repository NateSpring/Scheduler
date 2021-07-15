import React, { useContext, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";
import { HopperContext } from "../context/HopperContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { ScanModalTimer } from "./ScanModalTimer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TimerModal = ({ parts }) => {
  const {
    hopper,
    setHopper,
    cells,
    setCells,
    buildOrder,
    setNewCell,
    isModalOpen,
    setIsModalOpen,
  } = useContext(HopperContext);
  const [timer, setTimer] = useState();
  const [timerStatus, setTimerStatus] = useState();
  const [taktStatus, setTaktStatus] = useState([]);
  const [scanModalOpen, setScanModalOpen] = useState(false);

  return (
    <Modal
      className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
      isOpen={isModalOpen === parts.id}
      // onClose={() => {
      //   setIsModalOpen(false);
      // }}
    >
      <ModalHeader className="flex flex-col items-center">
        <FontAwesomeIcon
          icon={faStopwatch}
          size="lg"
          className={`text-${timerStatus}-500`}
        />
        Takt Timer
      </ModalHeader>
      <ModalBody className="flex flex-col items-center text-center">
        <h2>{parts.part_number}</h2>
        <h5>for {parts.customer}</h5>
        <p className="hidden sm:block">
          The Takt Timer for this build order has begun. If you have to STOP:
          don't hesitate to "Pull the Cord" below.
        </p>
        <p className="block sm:hidden">
          The Takt Timer for this build order has begun. If you have to STOP:
          don't hesitate to "Pull the Cord" below. Since you're on a mobile
          device, switch to your camera and scan this build orders' QR Code to
          stop the takt timer.
        </p>
        <p
          className={`bg-${timerStatus}-500 px-6 py-4 mt-4 text-white rounded-lg text-6xl w-full`}
        >
          {timer ? timer.time : "Test"}
        </p>
      </ModalBody>

      <ModalFooter>
        <ScanModalTimer taktTimerTime={timer} />

        <div className="hidden sm:block">
          <button className="bg-red-500 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm uppercase">
            Pull the Cord
          </button>
        </div>
        {/* <div className="hidden sm:block">
          <Button
            layout="outline"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div> */}
        <div className="block w-full sm:hidden">
          <Button
            block
            size="large"
            onClick={() => {
              setIsModalOpen(false);
              toast.error("RED TEAM ASSEMBLE!");
            }}
          >
            Pull the Cord
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
            Cancel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

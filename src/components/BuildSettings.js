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
  faClipboardList,
  faCog,
  faDumpsterFire,
} from "@fortawesome/free-solid-svg-icons";
import { HopperContext } from "../context/HopperContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InfoSettings } from "./InfoSettings";
import { OpenPartsLibrarySettings } from "./OpenPartsLibrarySettings";
import { DefectSettings } from "./DefectSettings";
import { RecutSettings } from "./RecutSettings";

import HotCard from "../assets/img/hot-icon.png";

export const BuildSettings = ({ build }) => {
  const { hopper, setHopper, cells, setCells } = useContext(HopperContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [defectModalOpen, setSettingsModalOpen] = useState(false);

  const setHotCard = async (id) => {
    let setHotness = await axios.post("/taktstatus", {
      takt_status: "hot",
      id: id,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setSettingsModalOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faCog}
          className={`p-1 transform rotate-45 hover:-rotate-180 hover:scale-150 transition-transform duration-1000 ease-out`}
          size="2x"
        />
      </button>

      {/* Defect modal */}
      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-gray-600 rounded-t-lg dark:bg-yellow-400 sm:rounded-lg sm:m-4 sm:max-w-xl"
        isOpen={defectModalOpen === true}
        onClose={() => {
          setSettingsModalOpen(false);
        }}
      >
        {/* <div className="bg-gray-100 p-2 m-2 rounded"> */}
        <ModalHeader className="flex flex-col items-center">
          <div className="text-white text-3xl text-shadow-md">
            <FontAwesomeIcon className="mr-2" icon={faClipboardList} />
            Build Settings
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center items-center text-center gap-3 rounded-lg p-2">
          <InfoSettings build={build} />
          {window && window.process && window.process.type == "renderer" && (
            <OpenPartsLibrarySettings build={build} />
          )}
          <DefectSettings build={build} />
          {build.takt_status != "recut" ? (
            <RecutSettings buttonText={"Create Recut"} build={build} />
          ) : (
            <RecutSettings buttonText={"Recut Information"} build={build} />
          )}
          {/* Production Page Set Build to Hot Card */}
          {window.location.pathname == "/app/production" && (
            <button
              className="flex flex-row justify-center align-center items-center mt-2 w-8/12 text-white bg-gradient-to-r from-red-500 to-red-800  animate-gradient-xy-superfast shadow hover:shadow-inner rounded
              "
              onClick={() => {
                setHotCard(build.id);
              }}
            >
              <img
                className="mr-1 p-1"
                src={HotCard}
                width="45px"
                height="45px"
              />
              <h2 className="text-lg font-semibold">Make Hot Card</h2>
            </button>
          )}
        </ModalBody>
        {/* </div> */}
        <ModalFooter>
          <div className="hidden sm:block">
            <Button
              layout="outline"
              onClick={() => {
                setSettingsModalOpen(false);
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

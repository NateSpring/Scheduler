import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHeader,
  Label,
} from "@windmill/react-ui";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BiListPlus, BiListMinus } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { RiScissorsCutFill } from "react-icons/ri";
import {
  faCog,
  faDumpsterFire,
  faBug,
} from "@fortawesome/free-solid-svg-icons";
import { HopperContext } from "../context/HopperContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RecutList = ({ build }) => {
  const [bomData, setBomData] = useState([{ part: "something", quan: 1 }]);

  let getScrappedPartsData = async () => {
    let getScrappedParts = await axios.post("/getrecutlist", {
      id: build.id,
    });
    if (getScrappedParts.data.length > 0) {
      if (JSON.parse(getScrappedParts.data[0].scrapped_parts).length > 0) {
        setBomData(JSON.parse(getScrappedParts.data[0].scrapped_parts));
      }
    }
  };
  getScrappedPartsData();

  return (
    <>
      <ul className="bg-white rounded text-black p-1 border-2 border-gray-500">
        <p
          className="bg-blue-600 rounded-t text-lg text-white font-semibold uppercase
        "
        >
          Recut list:
        </p>
        {bomData.length > 0 &&
          bomData.map((cutItem) => {
            return (
              <li className="border-t-2 border-gray-400">
                {cutItem.part} x {cutItem.quan}
              </li>
            );
          })}
      </ul>
    </>
  );
};

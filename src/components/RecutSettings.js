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

export const RecutSettings = ({ buttonText, build }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recutModalOpen, setRecutModalOpen] = useState(false);
  const [bomData, setBomData] = useState([{ checked: "", part: "", quan: 0 }]);
  const [scrapped, setScrapped] = useState([]);

  // Update Takt Status to Recut
  const reportScrappedPart = async () => {
    let createRecut = await axios
      .post("/recut", {
        qrCode: build.id,
      })
      .then((res) => {
        toast.success(ToastMsg(build.id, `Successfully Sent to Scheduler`));
      })
      .catch((err) => {
        console.log("Create Recut Fail: ", err.response.data);
        toast.error(ToastErr(build.id, err.response.data));
      });
  };

  // Save Array of Scrapped Parts
  const saveScrappedPartsList = async () => {
    let createRecutList = await axios
      .post("/recutlist", {
        id: build.id,
        sales_order: build.sales_order,
        part_number: build.part_number,
        scrapped_parts: scrapped,
      })
      .then((res) => {
        toast.success(ToastMsg(build.id, `Successfully Updated Recut List`));
        setRecutModalOpen(false);
      })
      .catch((err) => {
        console.log("Create Recut Fail: ", err.response.data);
        toast.error(ToastErr(build.id, err.response.data));
      });

    if (scrapped.length == 0) {
      returnToNormal();
    }
  };

  // Change Takt Status back to Normal (blue)
  const returnToNormal = async () => {
    await axios.post("/taktstatus", {
      id: build.id,
      takt_status: "blue",
    });
  };

  // Update scrapped everytime the bomData state is changed
  useEffect(() => {
    setScrapped(
      bomData.filter((bomItem) => {
        return bomItem.checked == "on";
      })
    );
  }, [bomData]);

  useEffect(() => {
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
  }, []);

  const getBomList = async () => {
    let getBom = await axios
      .post("/bomreader", {
        part: build.part_number,
      })
      .then((res) => {
        setBomData(res.data);
      });
  };

  // Clears Bom List
  const clearBomList = () => {
    setBomData([{ checked: "", part: "", quan: "" }]);
  };

  // Adds items to Bom List
  const addSubPart = () => {
    setBomData([...bomData, { checked: "", part: "", quan: "" }]);
  };

  const onChange = (e, i) => {
    let bomDataUpdated = [...bomData];
    if (bomDataUpdated[i][e.target.name] == "on") {
      bomDataUpdated[i][e.target.name] = "";
    } else {
      bomDataUpdated[i][e.target.name] = e.target.value;
    }
    console.log(bomDataUpdated[i]);
    setBomData(bomDataUpdated);
  };

  const ToastMsg = (buildOrder, message) => (
    <div>
      <RiScissorsCutFill />
      <p className="text-xl font-bold">Recut Created Successfully!</p>
      <p className="font-semibold">Build Order:</p>
      <span> {buildOrder}</span>
      {message && (
        <>
          <p className="font-semibold">{message}</p>
        </>
      )}
    </div>
  );
  const ToastErr = (buildOrder, error) => (
    <div>
      <RiScissorsCutFill />
      <p className="text-xl font-bold">Defect Report Failure!</p>
      <p className="font-semibold">Build Order:</p>
      <span>{buildOrder}</span>
      <p className="font-semibold">Error:</p>
      <span> {error}</span>
    </div>
  );

  return (
    <>
      <button
        className="flex flex-row justify-center align-center items-center p-2 w-8/12 bg-blue-500 hover:bg-blue-400 text-white shadow hover:shadow-inner rounded"
        onClick={() => {
          setRecutModalOpen(true);
        }}
      >
        <RiScissorsCutFill className="text-2xl mr-2" />

        <h2 className="text-lg font-semibold">{buttonText}</h2>
      </button>

      {/* Defect modal */}
      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-gradient-to-r from-blue-400 to-blue-900  animate-gradient-x-fast rounded-t-lg sm:rounded-lg sm:m-4 sm:max-w-xl"
        isOpen={recutModalOpen === true}
        onClose={() => {
          setRecutModalOpen(false);
        }}
      >
        <ModalHeader>
          <div className="flex flex-row justify-center items-center text-gray-50">
            <RiScissorsCutFill className="text-5xl mr-2" />
            {build.takt_status == "recut" ? "Update Recut" : "Create Recut"}
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-row justify-center text-center bg-white rounded-lg p-2 w-full ">
          <TableContainer className="h-128 overflow-y-scroll">
            <div className="flex flex-row justify-center gap-3">
              <button
                className="bg-green-400 hover:bg-green-500 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none mb-2 px-4 py-2 rounded shadow hover:shadow-none border-2 border-green-500 text-sm uppercase"
                onClick={getBomList}
              >
                <BiListPlus className="text-3xl mr-2" />
                Pull Parts List
              </button>
              <button
                className="bg-red-400 hover:bg-red-500 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none mb-2 px-4 py-2 rounded shadow hover:shadow-none border-2 border-red-500 text-sm uppercase"
                onClick={clearBomList}
              >
                <BiListMinus className="text-3xl mr-2" />
                Clear List
              </button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-center">
                  {build.takt_status == "recut" ? (
                    <TableCell>Uncheck if part has been recut</TableCell>
                  ) : (
                    <TableCell>Scrapped?</TableCell>
                  )}
                  <TableCell>Sub Part</TableCell>
                  <TableCell>Qty.</TableCell>
                </TableRow>
              </TableHeader>

              {bomData.map((subPart, i) => {
                return (
                  <TableRow key={i} className="text-center">
                    <TableCell className="border-b-2">
                      <input
                        className="w-full p-2 h-8 checked:bg-green-300"
                        type="checkbox"
                        checked={subPart.checked}
                        name="checked"
                        onChange={(e) => onChange(e, i)}
                      ></input>
                    </TableCell>
                    <TableCell className="border-b-2 ">
                      <input
                        className="p-3 rounded border-2 border-blue-400"
                        type="text"
                        name="part"
                        value={subPart.part}
                        onChange={(e) => onChange(e, i)}
                      ></input>
                    </TableCell>
                    <TableCell className="border-b-2">
                      <input
                        className="w-2/3 h-12 text-center rounded border-2 border-blue-400"
                        type="number"
                        name="quan"
                        min="0"
                        value={subPart.quan}
                        onChange={(e) => onChange(e, i)}
                      ></input>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
            <button
              className="bg-green-500 hover:bg-green-600 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none mt-2 px-4 py-1 rounded shadow hover:shadow-none border-2 border-green-600 text-sm uppercase"
              onClick={addSubPart}
            >
              <FaPlus className="text-xl mr-2" />
              Add Another Part
            </button>
          </TableContainer>
        </ModalBody>

        <ModalFooter className="flex flex-row ">
          <div className="hidden sm:block">
            {build.takt_status == "recut" ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg border-2 border-blue-600 shadow hover:shadow-none text-sm uppercase"
                onClick={() => {
                  saveScrappedPartsList();
                }}
              >
                Update Scrapped Parts
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg border-2 border-blue-600 shadow hover:shadow-none text-sm uppercase"
                onClick={() => {
                  reportScrappedPart();
                  saveScrappedPartsList();
                }}
              >
                Create Recut
              </button>
            )}
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              onClick={() => {
                reportScrappedPart();
                saveScrappedPartsList();
              }}
            >
              Create Recut
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              layout="outline"
              onClick={() => {
                setRecutModalOpen(false);
              }}
            >
              Cancel
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
    </>
  );
};

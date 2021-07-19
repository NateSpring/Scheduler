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
  Label,
} from "@windmill/react-ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faDumpsterFire,
  faBug,
} from "@fortawesome/free-solid-svg-icons";
import { HopperContext } from "../context/HopperContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DefectSettings = ({ build }) => {
  const { departmentFlow, hopper, setHopper, cells, setCells } =
    useContext(HopperContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defectModalOpen, setDefectModalOpen] = useState(false);
  const [defectInfo, setDefectInfo] = useState({
    defect_dept: -2,
    from_dept: build.current_dept,
    from_cell: build.current_cell,
    defect_category: "default",
    defect_description: "",
    scrapped: false,
    quantity: 0,
  });
  const onChange = (e) => {
    setDefectInfo({ ...defectInfo, [e.target.name]: e.target.value });
  };
  const reportDefect = async () => {
    console.log(defectInfo);
    let createDefect = await axios.post(
      "http://192.168.55.26:5000/create_defect",
      {
        id: build.id,
        sales_order: build.sales_order,
        part_number: build.part_number,
        defect_dept: defectInfo.defect_dept,
        from_dept: defectInfo.from_dept,
        from_cell: defectInfo.from_cell,
        defect_category: defectInfo.defect_category,
        defect_description: defectInfo.defect_description,
        scrapped: defectInfo.scrapped,
        quantity: defectInfo.quantity,
      }
    );
    if (createDefect.status == 200) {
      toast.warning("🐜 Defect Reported!");
      setDefectModalOpen(false);
    } else {
      toast.error("🐜 Error Reporting Defect, Please Try Again.");
    }
  };

  const ToastMsg = (buildOrder, message) => (
    <div>
      <FontAwesomeIcon icon={faDumpsterFire} />
      <p className="text-xl font-bold">Defect Reported Successfully!</p>
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
      <FontAwesomeIcon icon={faDumpsterFire} />
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
        className="flex flex-row justify-center align-center items-center p-2 w-8/12 bg-gray-200 hover:bg-gray-300 shadow hover:shadow-inner rounded"
        onClick={() => {
          setDefectModalOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faBug}
          className={`mr-4 p-1 transform rotate-45 hover:-rotate-180 hover:scale-125 transition-transform duration-1000 ease-out`}
          size="2x"
        />
        <h2 className="text-lg font-semibold">Defect</h2>
      </button>

      {/* Defect modal */}
      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-orange-500 rounded-t-lg dark:bg-orange-500 sm:rounded-lg sm:m-4 sm:max-w-xl"
        isOpen={defectModalOpen === true}
        onClose={() => {
          setDefectModalOpen(false);
        }}
      >
        <ModalHeader className="flex flex-col items-center bg-orange-500">
          <div className="text-gray-100">
            <FontAwesomeIcon
              className="p-0.5 mr-2 animate-bounce"
              icon={faDumpsterFire}
            />
            Report a Defect
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center text-center bg-white rounded-lg p-2 w-full">
          <TableContainer>
            <Table>
              <TableRow>
                <TableCell className="border-b-2">
                  <p className="text-lg font-semibold">
                    Where Did This Defect Occur?
                  </p>
                  <select
                    className="bg-gray-200 border-2 border-orange-300 dark:bg-gray-800 rounded p-3"
                    name="defect_dept"
                    value={defectInfo.defect_dept}
                    onChange={onChange}
                  >
                    <option value="-2" selected disabled>
                      Choose Department
                    </option>
                    {departmentFlow.map((dept) => {
                      if (Object.keys(dept) <= build.current_dept) {
                        return (
                          <option value={Object.keys(dept)}>
                            {dept[Object.keys(dept)]}
                          </option>
                        );
                      }
                    })}
                  </select>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-b-2">
                  <p className="text-lg font-semibold">Defect</p>
                  <select
                    className="bg-gray-200 border-2 border-orange-300 dark:bg-gray-800 rounded p-3"
                    name="defect_category"
                    value={defectInfo.defect_category}
                    onChange={onChange}
                  >
                    <option value="default" selected disabled>
                      Defect Category
                    </option>
                    <option value={"Scratches"}>Scratches</option>
                    <option value={"Bent Wrong"}>Bent Wrong</option>
                    <option value={"Burrs"}>Burrs</option>
                  </select>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border-b-2">
                  <p className="text-lg font-semibold">Description of Defect</p>
                  <textarea
                    name="defect_description"
                    onChange={onChange}
                    value={defectInfo.defect_description}
                    className="w-full p-2 h-20 border-2 border-orange-300 bg-gray-100 rounded "
                  ></textarea>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex flex-row justify-center">
                  <div>
                    <p className="text-lg font-semibold">Part Scrapped?</p>
                    <input
                      type="checkbox"
                      name="scrapped"
                      onChange={onChange}
                      value={true}
                      className="w-full p-2 h-8 border-2 border-orange-300 rounded "
                    ></input>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Quantity</p>
                    <input
                      type="number"
                      name="quantity"
                      onChange={onChange}
                      value={defectInfo.quantity}
                      className="w-1/2 p-2 border-2 border-orange-300 bg-gray-100 rounded "
                    ></input>
                  </div>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <div className="hidden sm:block">
            <button
              className="bg-orange-500 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm uppercase"
              onClick={reportDefect}
            >
              Report Defect
            </button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              onClick={() => {
                toast.error("🐜 Defect Report Failed! ");
              }}
            >
              Report Defect
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              layout="outline"
              onClick={() => {
                setDefectModalOpen(false);
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

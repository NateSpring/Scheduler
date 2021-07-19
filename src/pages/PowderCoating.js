import React, { useState, useEffect, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { sendToCell, TaktStatusIndicator } from "../utils";
import axios from "axios";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { HopperContext } from "../context/HopperContext";
import { ScanModal } from "../components/ScanModal";
import { BuildSettings } from "../components/BuildSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function PowderCoating() {
  const { hopper } = useContext(HopperContext);
  const [cells, setCells] = useState(["POWDER COATING"]);
  const changeCell = async (id, cell) => {
    const changeCell = await axios.get(
      `http://192.168.55.26:5000/cell?id=${id}&current_cell=${cell}`
    );
    // setNewCell({ pid: id, ccell: cell });
    sendToCell(id, cell);
  };
  const [saveIcon, setSaveIcon] = useState(false);
  const [operator, setOperator] = useState({});
  const [operatorData, setOperatorData] = useState([]);
  // Initialize Operator Data:
  useEffect(async () => {
    let cellOps = await axios.get("http://192.168.55.26:5000/get_operator");
    setOperatorData(cellOps.data);
  }, []);

  // Update Operator Data:
  const changeOperator = (e) => {
    console.log(`cell: ${e.target.name}, Op: ${e.target.value} `);
    setOperator({ cell: e.target.name, operator: e.target.value });
    setSaveIcon({ cell: e.target.name, on: true });
    setOperatorData(
      operatorData.map((op) =>
        op.cell === e.target.name ? { ...op, operator: e.target.value } : op
      )
    );
  };
  // Save Operator Data:
  const saveOperator = () => {
    axios.post("http://192.168.55.26:5000/save_operator", {
      cell: operator.cell,
      operator: operator.operator,
    });
    toast.success(`Welcome to ${operator.cell}, ${operator.operator}`);

    setSaveIcon(false);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle>POWDER COATING</PageTitle>
        <ScanModal scanDept={10} />
      </div>
      <TableContainer>
        <div className="h-auto px-4 py-4 bg-blue-200 dark:bg-blue-800 m-2 rounded flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 p-4">
            Hopper
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Part</TableCell>
                <TableCell>Qty.</TableCell>
                <TableCell>Purchase Order</TableCell>
                <TableCell></TableCell>
                <TableCell>Release Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hopper.map((parts, i) => {
                if (
                  parts.current_dept === 10 &&
                  parts.current_cell === "hopper"
                ) {
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex flex-col items-start text-sm">
                          <p className="font-bold text-lg">
                            {parts.part_number}
                          </p>
                          <p className="font-semibold">{parts.part_data[1]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-xl"
                          onClick={async () => {
                            await axios.post("/reset", {
                              qrCode: parts.id,
                            });
                          }}
                        >
                          x {parts.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">#{parts.sales_order}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {parts.customer}
                        </p>
                      </TableCell>
                      <TableCell>
                        <select
                          className="bg-gray-200 dark:bg-gray-800 rounded p-3"
                          value={0}
                          onChange={(e) => {
                            changeCell(parts.id, e.target.value);
                          }}
                        >
                          <option value="0" selected disabled>
                            Assign to Cell
                          </option>
                          {cells.map((cell, i) => {
                            return (
                              <option key={i} value={cell}>
                                Send to Cell: {cell}
                              </option>
                            );
                          })}
                        </select>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {parts.release_date.split("-")[1]}-
                          {parts.release_date.split("-")[2].split("T")[0]}-
                          {parts.release_date.split("-")[0]}{" "}
                        </span>
                      </TableCell>
                      <TableCell>
                        <BuildSettings build={parts} />
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </div>
      </TableContainer>

      {/* START CELL LOOP */}
      {cells.map((cell, i) => {
        return (
          <>
            <TableContainer key={i}>
              <div className="h-auto px-4 py-4 bg-gray-200 dark:bg-gray-800 m-2 rounded flex flex-col ">
                <div className="flex flex-col md:flex-row justify-center">
                  <div className="flex items-center justify-center text-6xl font-bold bg-gray-600 items rounded-none md:rounded-tl-lg shadow-lg text-gray-50 dark:text-gray-200 text-center p-2 md:w-1/2">
                    <h2>{cell}</h2>
                  </div>
                  <div className="flex flex-col items-center justify-center md:rounded-tr-lg md:w-1/2 bg-gray-600 pt-2">
                    <h3 className="text-xl text-white font-semibold ">
                      Current Operator:
                    </h3>
                    <div className="flex flex-col justify-center text-center bg-blue-600 rounded-lg mb-4 p-4 w-4/10">
                      <h3 className="text-2xl text-white font-semibold leading-none">
                        HELLO
                      </h3>
                      <h3 className="text-md text-white font-semibold leading-none">
                        my name is
                      </h3>
                      {operatorData.map((op) => {
                        if (op.cell == cell) {
                          return (
                            <>
                              <input
                                type="text"
                                className="border-2 border-blue-300 rounded m-2 h-10 p-1"
                                name={op.cell}
                                value={op.operator}
                                onChange={changeOperator}
                              ></input>
                              <button
                                className={` ${
                                  saveIcon.on == true && saveIcon.cell == cell
                                    ? "block"
                                    : "hidden"
                                } bg-gray-400 hover:bg-green-400 hover:shadow-none shadow-lg rounded-lg h-10 w-10  m-2`}
                                onClick={() => {
                                  saveOperator();
                                  changeCell("OP Change", "New OP");
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faUserCheck}
                                  className={`text-white p-1`}
                                  size="2x"
                                />
                              </button>
                            </>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Part</TableCell>
                      <TableCell>Qty.</TableCell>
                      <TableCell>PurchaseOrder</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Release Date</TableCell>
                      <TableCell></TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {hopper.map((parts, i) => {
                      if (
                        parts.current_dept === 10 &&
                        parts.current_cell === cell
                      ) {
                        return (
                          <>
                            <TableRow
                              key={i}
                              className={`bg-${parts.takt_status}-500 text-white`}
                            >
                              <TableCell>
                                <div className="flex flex-col items-start text-sm">
                                  <p className="font-bold text-lg">
                                    {parts.part_number}
                                  </p>
                                  <p className="font-semibold">
                                    {parts.part_data[1]}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className="text-xl"
                                  onClick={async () => {
                                    await axios.post("/reset", {
                                      qrCode: parts.id,
                                    });
                                  }}
                                >
                                  x {parts.quantity}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  #{parts.sales_order}
                                </span>
                                <p className="text-xs">{parts.id}</p>
                                <p className="text-xs text-white ">
                                  {parts.customer}
                                </p>
                              </TableCell>
                              <TableCell>
                                <select
                                  className="bg-gray-200 dark:bg-gray-600 rounded p-3 text-gray-800 dark:text-gray-200"
                                  onChange={(e) => {
                                    changeCell(parts.id, e.target.value);
                                  }}
                                >
                                  <option value="" selected disabled>
                                    Assign to Cell
                                  </option>
                                  <option value="hopper">Hopper</option>
                                  {cells.map((cell, i) => {
                                    return (
                                      <option key={i} value={cell}>
                                        Send to Cell: {cell}
                                      </option>
                                    );
                                  })}
                                </select>
                              </TableCell>
                              <TableCell>
                                {TaktStatusIndicator(parts.takt_status)}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {parts.release_date.split("-")[1]}-
                                  {
                                    parts.release_date
                                      .split("-")[2]
                                      .split("T")[0]
                                  }
                                  -{parts.release_date.split("-")[0]}{" "}
                                </span>
                              </TableCell>
                              <TableCell>
                                <BuildSettings build={parts} />
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      } else {
                        return <></>;
                      }
                    })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </>
        );
      })}
      {/* END CELL LOOP */}
    </>
  );
}
export default PowderCoating;

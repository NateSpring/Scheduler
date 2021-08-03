import React, { useState, useEffect, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { sendToCell, StatusColor, StatusIndicator } from "../utils";
import axios from "axios";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import {
  piData,
  taktTrackerData,
  defectLogData,
  defectCount,
  queueData,
  getOperatorCount,
  queueColorGenerator,
  progressLength,
  getSchedulerCapacity,
  cartCap,
} from "../utils/dashboardData";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";
import { HopperContext } from "../context/HopperContext";
import { ScanModal } from "../components/ScanModal";
import { BuildSettings } from "../components/BuildSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { RecutList } from "../components/RecutList";

function Laser() {
  const { hopper, operatorData, setOperatorData, completedTakts, defectLog } =
    useContext(HopperContext);
  const [saveIcon, setSaveIcon] = useState(false);
  const [operator, setOperator] = useState({});
  const [cells, setCells] = useState(["Sheet Laser"]);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const changeCell = async (id, cell) => {
    const changeCell = await axios.get(
      `http://192.168.55.26:5000/cell?id=${id}&current_cell=${cell}`
    );
    // setNewCell({ pid: id, ccell: cell });
    sendToCell(id, cell);
  };

  // Update Operator Data:
  const changeOperator = (e) => {
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
    toast.success(`Welcome to ${operator.cell}, ${operator.operator}!`);
    setSaveIcon(false);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle>LASER</PageTitle>
      </div>
      {/* Dept Cart/Capacity Dashboard Metrics */}
      <div className="flex flex-col border border-gray-300 m-2 w-full justify-center rounded-lg shadow">
        <TableContainer className="flex flex-col items-center w-full h-full">
          <TableBody className="shadow-lg w-full h-full">
            <h2 className="bg-gray-100 text-3xl border-b-2 border-gray-300 font-semibold text-center">
              Current Status
            </h2>
            <TableRow className="dark:bg-gray-700 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-600">
              <TableCell className="w-1/3 border-b-2">
                <div className="text-md font-semibold p-1 w-1/4">
                  Cart Capacity
                </div>
              </TableCell>
              <TableCell className="border-b-2">
                {cartCap(
                  hopper.filter((item) => {
                    return item.current_dept === 1;
                  }).length,
                  10
                )}
              </TableCell>
            </TableRow>

            <TableRow className="dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <TableCell className="border-b-2">
                <span className="font-semibold mr-2 text-md">
                  Current Capacity
                </span>
              </TableCell>
              <TableCell className="border-b-2">
                <div className="relative flex items-center p-0.25 bg-gray-200 border-2 border-gray-200 w-full h-9 rounded-lg shadow-inner">
                  <div
                    className={`absolute flex justify-center items-center z-2 h-8 shadow-xl font-bold text-xl text-white text-center rounded-l-lg rounded-r-xl ${progressLength(
                      getSchedulerCapacity(
                        1,
                        operatorData.filter((operator) => {
                          return operator.operator !== "" && operator.dept == 1;
                        }),
                        hopper.filter((build) => {
                          return build.current_dept == 1;
                        })
                      )
                    )}`}
                  >
                    {getSchedulerCapacity(
                      1,
                      operatorData.filter((operator) => {
                        return operator.operator !== "" && operator.dept == 1;
                      }),
                      hopper.filter((build) => {
                        return build.current_dept == 1;
                      })
                    )}
                    %
                  </div>
                </div>
              </TableCell>
            </TableRow>

            <TableRow className="dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
              <TableCell className="border-b-2">
                <span className="font-semibold mr-2 text-md">
                  Current Queue Hours
                </span>
              </TableCell>
              <TableCell className="border-b-2">
                <span className="text-3xl text-white font-semibold bg-blue-500 px-2 rounded">
                  {queueData(
                    hopper.filter((item) => {
                      return item.current_dept === 1;
                    })
                  )}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </TableContainer>
      </div>
      {/* Metric Tabs*/}
      {/* Hopper Container */}
      <TableContainer
        className="shadow border border-gray-300 px-4 py-4
     m-2 rounded"
      >
        <div className="h-auto rounded flex flex-col items-start">
          <div
            className="flex items-center justify-center 
        text-6xl font-bold 
        bg-gradient-to-r
        from-blue-400
        to-blue-800
        via-blue-400
        animate-gradient-xy-slow 
        rounded-none 
        md:rounded-t-lg 
        text-gray-50 dark:text-gray-200 text-center py-4 md:w-full
        "
          >
            <h2>Hopper</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableCell>Status</TableCell>

                <TableCell>Part</TableCell>
                <TableCell>Qty.</TableCell>
                <TableCell>Purchase Order</TableCell>
                <TableCell></TableCell>

                <TableCell>Release Date</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hopper.map((parts, i) => {
                if (
                  parts.current_dept === 1 &&
                  parts.current_cell === "hopper"
                ) {
                  return (
                    <TableRow
                      key={i}
                      className={`${
                        StatusColor(parts.takt_status).light
                      } hover:${StatusColor(parts.takt_status).dark}
                    text-white text-center
                    transition duration-250 ease-in-out transform 
                    hover:scale-98
                    `}
                    >
                      <TableCell>
                        {StatusIndicator(parts.takt_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col justify-center text-sm">
                          <p className="font-bold text-lg">
                            {parts.part_number}
                          </p>
                          <p className="font-semibold">{parts.part_data[1]}</p>
                          {parts.takt_status == "recut" && (
                            <RecutList build={parts} />
                          )}
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
                        <span className="text-lg font-semibold">
                          #{parts.sales_order}
                        </span>
                        <p className="text-sm font-semibold">
                          {parts.customer}
                        </p>
                        <p className="text-xs">{parts.id} </p>
                      </TableCell>
                      <TableCell>
                        <select
                          className="bg-gray-200 dark:bg-gray-600 rounded p-2 text-gray-800 dark:text-gray-200 shadow-lg border-2 border-gray-500"
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
                                {cell}
                              </option>
                            );
                          })}
                        </select>
                      </TableCell>

                      <TableCell>
                        <span className="text-lg font-semibold">
                          {parts.release_date.split("-")[1]}-
                          {parts.release_date.split("-")[2].split("T")[0]}
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
            <TableContainer
              className="shadow-lg border border-gray-300 px-4 py-4  bg-gray-100 dark:bg-gray-800 m-2 rounded "
              key={i}
            >
              <div className="h-auto flex flex-col ">
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
                    <TableRow className="text-center">
                      <TableCell>Status</TableCell>

                      <TableCell>Part</TableCell>
                      <TableCell>Qty.</TableCell>
                      <TableCell>PurchaseOrder</TableCell>
                      <TableCell></TableCell>
                      <TableCell>Release Date</TableCell>
                      <TableCell>
                        <ScanModal scanDept={1} />
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hopper.map((parts, i) => {
                      if (
                        parts.current_dept === 1 &&
                        parts.current_cell === cell
                      ) {
                        return (
                          <>
                            <TableRow
                              key={i}
                              className={`${
                                StatusColor(parts.takt_status).light
                              } hover:${StatusColor(parts.takt_status).dark} 
                              text-white text-center
                              transition duration-250 ease-in-out transform 
                              hover:scale-98 hover:shadow-2xl 
                              `}
                            >
                              <TableCell>
                                {StatusIndicator(parts.takt_status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col justify-center text-sm">
                                  <p className="font-bold text-lg">
                                    {parts.part_number}
                                  </p>
                                  <p className="font-semibold">
                                    {parts.part_data[1]}
                                  </p>
                                  {parts.takt_status == "recut" && (
                                    <RecutList build={parts} />
                                  )}
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
                                <span className="text-lg font-semibold">
                                  #{parts.sales_order}
                                </span>
                                <p className="text-sm font-semibold ">
                                  {parts.customer}
                                </p>
                                <p className="text-xs">{parts.id} </p>
                              </TableCell>
                              <TableCell>
                                <select
                                  className="bg-gray-200 dark:bg-gray-600 rounded p-2 text-gray-800 dark:text-gray-200 shadow-lg border-2 border-gray-500"
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
                                        {cell}
                                      </option>
                                    );
                                  })}
                                </select>
                              </TableCell>

                              <TableCell>
                                <span className="text-lg">
                                  {parts.release_date.split("-")[1]}-
                                  {
                                    parts.release_date
                                      .split("-")[2]
                                      .split("T")[0]
                                  }
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

export default Laser;

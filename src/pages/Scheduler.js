import React, { useState, useEffect, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { format } from "date-fns";
import axios from "axios";
import { Label } from "@windmill/react-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faRocket } from "@fortawesome/free-solid-svg-icons";
import { IoRocketSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MouseParticles from "react-mouse-particles";
import Sparkle from "react-sparkle";
import { HopperContext } from "../context/HopperContext";
import { StatusColor, StatusIndicator } from "../utils";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import routes from "../routes/sidebar";
import { getSchedulerCapacity, progressLength } from "../utils/dashboardData";
import { RecutList } from "../components/RecutList";

function Scheduler() {
  const { hopper, operatorData } = useContext(HopperContext);
  const [partyTime, setPartyTime] = useState(false);
  const [readyForLaunch, setReadyForLaunch] = useState({
    id: "",
    launch: false,
  });
  const [buildOrder, setBuildOrder] = useState({
    part: "",
    quantity: "",
    salesNumber: "",
    customerName: "",
    release: `${format(new Date(), "yyyy-MM-dd")}`,
    qrCode: "",
    notes: "",
  });
  const dept_flow = {
    0: "Nesting",
    1: "Laser",
    2: "Press Brake",
    3: "Tube Fab",
    4: "Tube Bender",
    5: "Saw",
    6: "Mill",
    7: "Lathe",
    8: "Welding",
    9: "Robot Welding",
    10: "Powder Coating",
    11: "Hardware",
    12: "Final Assembly",
    13: "Packaging",
    14: "Shipping",
  };

  const ToastMsg = (order) => (
    <div className="font-semibold">
      <p className="text-xl font-semibold">Build Order Successful!</p>
      <p>
        {order.part}
        <span className="font-semibold pl-2">x {order.quantity}</span>
      </p>
      <p>Sales #: {order.salesNumber}</p>
      <p>Customer: {order.customerName}</p>
    </div>
  );
  const ToastLaunch = (order, nextDept) => (
    <div className="font-semibold">
      <IoRocketSharp className="text-white animate-wiggle-crack transform -rotate-45" />
      <p className="text-xl font-semibold">
        Successfully Launched to {nextDept}!
      </p>
    </div>
  );
  const ToastErr = (order, error) => (
    <div className="font-semibold">
      <p className="text-xl font-semibold">Build Order Failed!</p>
      <p className="font-semibold">Error: {error.message}</p>
      <p>
        {order.part}
        <span className="font-semibold pl-2">x{order.quantity}</span>
      </p>
      <p>Sales #: {order.salesNumber}</p>
      <p>Customer: {order.customerName}</p>
    </div>
  );

  const onChange = (e) => {
    setBuildOrder({ ...buildOrder, [e.target.name]: e.target.value });
    // buildOrder.part == 77 ? setPartyTime(true) : setPartyTime(false);
  };

  const clearFields = () => {
    setBuildOrder({
      part: "",
      quantity: "",
      salesNumber: "",
      customerName: "",
      release: `${format(new Date(), "yyyy-MM-dd")}`,
      qrCode: "",
      notes: "",
    });
  };

  const startBuildOrder = (order, persist) => {
    let emptyFields = false;
    Object.keys(order).map((orderItems) => {
      if (order[orderItems] == "" && orderItems !== "notes") {
        emptyFields = true;
        let prettifiedFieldNames = {
          part: "Part Number",
          quantity: "Quantity",
          salesNumber: "Sales Number",
          customerName: "Customer Name",
          release: "Release Date",
          qrCode: "QR Code",
        };
        return toast.error(`Empty Field: ${prettifiedFieldNames[orderItems]}`);
      }
    });
    if (emptyFields == false) {
      const createBuildOrder = async () => {
        const response = await axios
          .post("/create_build", {
            part: order.part,
            quantity: order.quantity,
            salesNumber: order.salesNumber,
            customerName: order.customerName,
            release: order.release,
            qrCode: order.qrCode,
            notes: order.notes,
          })
          .then((res) => {
            console.log("Order Created", res.data);
            res.data.status === "error"
              ? toast.error(ToastErr(order, res.data))
              : toast.success(ToastMsg(order));
            if (persist == true) {
              setBuildOrder({
                ...buildOrder,
                part: "",
                quantity: "",
                notes: "",
                qrCode: "",
              });
            } else {
              clearFields();
            }
          });
      };
      createBuildOrder();
    }
  };

  const launch = async (buildOrderId) => {
    hopper.map(async (item) => {
      if (item.id === buildOrderId) {
        var nextStep = 1;
        var nextDept = 0;
        item.part_data.slice(78, 93).map((dept, i) => {
          let multipass = dept.split(",");
          if (multipass.includes(nextStep.toString())) {
            nextDept = i;
          }
        });

        axios
          .post("http://192.168.55.26:5000/scan", {
            qrCode: buildOrderId,
            current_dept: item.current_dept,
            sales_order: item.sales_order,
            part_number: item.part_number,
            qty: item.quantity,
            takt_status: item.takt_status,
            nextDept: nextDept,
          })
          .then((res) => {
            toast.success(ToastLaunch(item, dept_flow[nextDept]));
          })
          .catch((err) => {
            console.log("Scan fail: ", err.response.data);
            toast.error(ToastErr(buildOrderId, err.response.data));
          });
      }
    });
  };

  return (
    <>
      <PageTitle>Scheduler</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <div
          className={`shadow border border-gray-300 p-4
          m-2 rounded w-full text-center
          ${
            partyTime
              ? "bg-gradient-to-r from-blue-300 via-yellow-300 to-pink-300 dark:bg-blue-800"
              : "bg-gray-100"
          } 
           `}
        >
          {partyTime ? (
            <>
              <Sparkle
                color={"#FFF"}
                count={50}
                minSize={15}
                maxSize={18}
                overflowPx={20}
                fadeOutSpeed={50}
                // Whether we should create an entirely new sparkle when one
                // fades out. If false, we'll just reset the opacity, keeping
                // all other attributes of the sparkle the same.
                newSparkleOnFadeOut={true}
                // Whether sparkles should have a "flickering" effect.
                flicker={true}
                // How quickly the "flickering" should happen.
                // One of: 'slowest', 'slower', 'slow', 'normal', 'fast', 'faster', 'fastest'
                flickerSpeed={"normal"}
              />

              <h2 className="text-6xl font-bold text-gray-900 dark:text-gray-200 underline">
                Creation Station
              </h2>
              <MouseParticles
                g={2}
                radius={5}
                life={1.5}
                color="random"
                cull="col,image-wrapper"
              />
            </>
          ) : (
            <>
              <div
                className="flex items-center justify-center 
          text-6xl font-bold 
          bg-gradient-to-r
          from-green-400
          to-green-800
          via-green-600
          animate-gradient-xy-slow 
          rounded-none 
          md:rounded-t-lg 
          text-gray-50 dark:text-gray-200 text-center py-4 md:w-full
          "
              >
                <h2>Create Build</h2>
              </div>
            </>
          )}
          <div>
            <div
              className={`${
                partyTime
                  ? "bg-gradient-to-r from-blue-300 via-yellow-300 to-pink-300 dark:bg-blue-800"
                  : "bg-gray-100"
              } `}
            >
              <div className="flex flex-col justify-center w-full align-center">
                <div className="flex justify-center">
                  <div className="flex flex-col w-1/2">
                    <Label>
                      <span className="font-semibold text-xl text-gray-900">
                        Sales Order #
                      </span>
                    </Label>
                    <input
                      className="p-4 border-4 rounded h-8 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                      name="salesNumber"
                      value={buildOrder.salesNumber}
                      onChange={onChange}
                      type="number"
                      placeholder="Sales #"
                    ></input>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col w-1/2">
                    <Label>
                      <span className="font-semibold text-xl text-gray-900">
                        Customer Name
                      </span>
                    </Label>
                    <input
                      className="p-4 border-4 rounded h-8 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                      name="customerName"
                      value={buildOrder.customerName}
                      onChange={onChange}
                      type="text"
                      placeholder="Customer"
                    ></input>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col">
                    <Label>
                      <span className="font-semibold text-xl text-gray-900">
                        Part #
                      </span>
                    </Label>
                    <input
                      className="p-4 w-full border-4 rounded h-8 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                      name="part"
                      value={buildOrder.part}
                      onChange={onChange}
                      type="text"
                      placeholder="ITD1234"
                    ></input>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex flex-col w-1/4">
                    <Label>
                      <span className="font-semibold text-xl text-gray-900">
                        Quantity
                      </span>
                    </Label>
                    <input
                      className="p-4 w-full border-4 rounded h-8 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                      name="quantity"
                      value={buildOrder.quantity}
                      onChange={onChange}
                      type="number"
                      placeholder="1"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col w-1/2">
                  <Label>
                    <span className="font-semibold text-xl text-gray-900">
                      Release Date
                    </span>
                  </Label>
                  <input
                    className="p-4 border-4 rounded h-8 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                    name="release"
                    value={buildOrder.release}
                    onChange={onChange}
                    type="date"
                    placeholder="2021-04-15"
                  ></input>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col w-1/2">
                  <Label>
                    <span className="font-semibold text-xl text-gray-900">
                      QR Code Link
                    </span>
                  </Label>
                  <input
                    className="p-4 border-4 rounded h-8 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                    name="qrCode"
                    value={buildOrder.qrCode}
                    onChange={onChange}
                    type="text"
                    placeholder="Build Order QR Code Here"
                  ></input>
                </div>
              </div>
              <div className="flex justify-center">
                {/*
                ************** NOTES ***********
                <div className="flex flex-col w-1/2">
                  <Label>
                    <span className="font-semibold text-xl">Build Notes</span>
                  </Label>
                  <textarea
                    className="p-4 border-4 rounded  h-32 focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
                    name="notes"
                    value={buildOrder.notes}
                    onChange={onChange}
                    type="text"
                    placeholder="Notes"
                  ></textarea>
                </div> */}
              </div>
              <div className="flex justify-center mt-5">
                <div className="flex flex-row space-around">
                  <button
                    className="p-2 m-2 h-12 flex items-center justify-center bg-green-400 hover:bg-green-500 rounded hover:rounded-lg shadow-lg text-white"
                    onClick={() => {
                      startBuildOrder(buildOrder, false);
                    }}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faPlus} />
                    <p className="font-semibold uppercase ">Create</p>
                  </button>
                  <button
                    className="p-2 m-2 h-12 flex items-center justify-center bg-blue-400 hover:bg-yellow-500 rounded hover:rounded-lg shadow-lg text-white"
                    onClick={() => {
                      startBuildOrder(buildOrder, true);
                    }}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faPlus} />
                    <p className="font-semibold uppercase ">Next Card</p>
                  </button>
                  <button
                    className="p-2 m-2 h-12 flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded hover:rounded-lg shadow-lg"
                    onClick={() => {
                      clearFields();
                    }}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faMinus} />
                    <p className="font-semibold uppercase">Clear</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Scheduler Hopper */}
          <div
            className="flex flex-col w-full gap-2 bg-gray-100 mt-10   
"
          >
            <TableContainer
              className="shadow border border-gray-300 
        rounded"
            >
              <div className="h-auto rounded flex flex-col items-start">
                <div
                  className="flex items-center justify-center 
          text-6xl font-bold 
          bg-gradient-to-r
          from-green-400
          to-green-800
          via-green-600
          animate-gradient-xy-slow 
          rounded-none 
          md:rounded-t-lg 
          text-gray-50 dark:text-gray-200 text-center py-4 w-full
          "
                >
                  <h2>Staging</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="text-center">
                      <TableCell></TableCell>
                      <TableCell>Part</TableCell>
                      <TableCell>Qty.</TableCell>
                      <TableCell>Purchase Order</TableCell>
                      <TableCell>Release Date</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-center">
                    {hopper.map((parts, i) => {
                      if (
                        parts.current_dept === -1 &&
                        parts.current_cell === "hopper"
                      ) {
                        return (
                          <TableRow
                            key={i}
                            className={`
                            ${
                              readyForLaunch.id == parts.id &&
                              parts.takt_status != "recut" &&
                              "bg-green-500 text-white"
                            }
                            ${
                              parts.takt_status == "recut" &&
                              StatusColor(parts.takt_status).light
                            } text-center
                            `}
                            onMouseEnter={() => {
                              setReadyForLaunch({
                                id: parts.id,
                                launch: true,
                              });
                            }}
                            onMouseLeave={() => {
                              setReadyForLaunch({
                                id: "",
                                launch: false,
                              });
                            }}
                          >
                            <TableCell>
                              {parts.takt_status == "recut" &&
                                StatusIndicator(parts.takt_status)}
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
                              <p className="text-lg ">{parts.customer}</p>

                              <span className="text-sm">
                                #{parts.sales_order}
                              </span>
                              <p className="text-xs">{parts.id}</p>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {parts.release_date.split("-")[1]}-
                                {parts.release_date.split("-")[2].split("T")[0]}
                                -{parts.release_date.split("-")[0]}{" "}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {/* <BuildSettings build={parts} /> */}
                              {readyForLaunch.id == parts.id ? (
                                <IoRocketSharp
                                  onClick={() => {
                                    launch(parts.id);
                                  }}
                                  className="text-white animate-wiggle-crack
                                 transform -rotate-45 text-4xl"
                                />
                              ) : (
                                <IoRocketSharp
                                  className="text-black
                              text-4xl"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 bg-gray-100 p-4 m-2 border border-gray-300 rounded shadow">
          <div
            className="flex items-center justify-center 
          text-6xl font-bold 
          bg-gradient-to-r
          from-green-500
          to-red-500
          via-yellow-300
          animate-gradient-xy-slow 
          rounded-none 
          md:rounded-t-lg 
          text-gray-50 dark:text-gray-200 text-center py-4 w-full
          "
          >
            <h2>Staged Capacity</h2>
          </div>
          {routes.map((route) => {
            if (
              route.name == "Dashboard" ||
              route.name == "Scheduler" ||
              route.name == "Nesting"
              // || route.name == 'Hardware'
            ) {
            } else {
              return (
                <div
                  key={route.id}
                  className="bg-gray-50 border-2 border-gray-300 p-2 rounded-lg shadow-lg"
                >
                  {/* <p className="p-2 font-semibold text-2xl">
                    {route.name} Capacity
                  </p> */}

                  <div className="flex flex-row items-center justify-center rounded-xl bg-gray-50">
                    <div className="text-lg font-bold p-1 w-1/4">
                      {route.name}
                    </div>
                    <div className="relative flex items-center p-0.25 bg-gray-200 border-2 border-gray-200 w-full h-9 rounded-lg shadow-inner">
                      <div
                        className={`absolute flex justify-center items-center z-2 h-8 shadow-xl font-bold text-xl text-white text-center rounded-l-lg rounded-r-xl ${progressLength(
                          getSchedulerCapacity(
                            route.id,
                            operatorData.filter((operator) => {
                              return (
                                operator.operator !== "" &&
                                operator.dept == route.id
                              );
                            }),
                            hopper.filter((build) => {
                              return build.current_dept == -1;
                            })
                          )
                        )}`}
                      >
                        {getSchedulerCapacity(
                          route.id,
                          operatorData.filter((operator) => {
                            return (
                              operator.operator !== "" &&
                              operator.dept == route.id
                            );
                          }),
                          hopper.filter((build) => {
                            return build.current_dept == -1;
                          })
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}

export default Scheduler;

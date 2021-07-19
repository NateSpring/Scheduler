import React, { useState, useEffect, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { format } from "date-fns";
import axios from "axios";
import { Label } from "@windmill/react-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faRocket } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MouseParticles from "react-mouse-particles";
import Sparkle from "react-sparkle";
import { HopperContext } from "../context/HopperContext";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { BuildSettings } from "../components/BuildSettings";
import routes from "../routes/sidebar";
import { getOperatorCount, progressLength } from "../utils/dashboardData";

function Scheduler() {
  const { hopper, operatorData } = useContext(HopperContext);
  const [partyTime, setPartyTime] = useState(false);
  const [readyForLaunch, setReadyForLaunch] = useState(false);
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
    buildOrder.part == 77 ? setPartyTime(true) : setPartyTime(false);
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

  const startBuildOrder = (order) => {
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
          .post("http://192.168.55.26:5000/create_build", {
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
            setBuildOrder({
              ...buildOrder,
              part: "",
              quantity: "",
              qrCode: "",
              notes: "",
            });
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
          console.log(multipass, nextStep.toString());
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
            nextDept: nextDept,
          })
          .then((res) => {
            toast.success(`Successfully Sent to ${dept_flow[nextDept]}`);
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
      <ToastContainer autoClose={3000} pauseOnHover draggable closeOnClick />
      <PageTitle>Scheduler</PageTitle>
      <div className="flex flex-col xl:flex-row w-full h-full mb-10">
        <div
          className={`py-4 m-1 rounded flex flex-col w-full xl:w-1/2 text-center
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
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-10">
                Build Order Creation
              </h2>
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
              <div className="flex justify-center">
                <div className="flex flex-col w-1/2">
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
                    placeholder="Sales"
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
              <div className="flex justify-center">
                <div className="flex flex-row space-around">
                  <button
                    className="p-2 m-2 h-12 flex items-center justify-center bg-green-400 hover:bg-green-500 rounded hover:rounded-lg shadow-lg text-white"
                    onClick={() => {
                      startBuildOrder(buildOrder);
                    }}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faPlus} />
                    <p className="font-semibold uppercase ">Create</p>
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
          <TableContainer>
            <div className="h-auto px-4 py-4 bg-blue-200 dark:bg-blue-800 m-2 rounded flex flex-col items-start">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 p-4">
                Release Staging
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Part</TableCell>
                    <TableCell>Qty.</TableCell>
                    <TableCell>Purchase Order</TableCell>
                    <TableCell>Release Date</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hopper.map((parts, i) => {
                    if (
                      parts.current_dept === -1 &&
                      parts.current_cell === "hopper"
                    ) {
                      return (
                        <TableRow
                          key={i}
                          className={`${
                            readyForLaunch && "bg-green-500 text-white"
                          }`}
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

                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {parts.customer}
                            </p>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {parts.release_date.split("-")[1]}-
                              {parts.release_date.split("-")[2].split("T")[0]}-
                              {parts.release_date.split("-")[0]}{" "}
                            </span>
                          </TableCell>
                          <TableCell>
                            {/* <BuildSettings build={parts} /> */}
                            <FontAwesomeIcon
                              onClick={() => {
                                launch(parts.id);
                              }}
                              size="2x"
                              icon={faRocket}
                              // className={`
                              // ${
                              //   readyForLaunch && "text-white animate-wiggle"
                              // } p-1 transform -rotate-45 hover:scale-150`}
                              // onMouseEnter={() => {
                              //   setReadyForLaunch(true);
                              // }}
                              // onMouseLeave={() => {
                              //   setReadyForLaunch(false);
                              // }}
                            />
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

        <div className="flex flex-col w-full xl:w-1/2 gap-2 bg-gray-100 p-2 m-1">
          {routes.map((route) => {
            if (route.name == "Dashboard" || route.name == "Scheduler") {
            } else {
              return (
                <div key={route.id} className="bg-gray-50 p-2 rounded-lg">
                  {/* <p className="p-2 font-semibold text-2xl">
                    {route.name} Capacity
                  </p> */}

                  <div className="flex flex-row rounded-xl bg-gray-50 ">
                    <div className="text-lg font-bold p-1 w-1/4">
                      {route.name}
                    </div>
                    <div
                      className={` w-3/4 rounded-xl shadow-lg font-bold text-2xl p-0.5 text-white text-center ${progressLength(
                        (
                          (hopper.filter((item) => {
                            return item.current_dept === route.id;
                          }).length /
                            route.cap) *
                          100
                        ).toFixed(2)
                      )} pr-1 rounded`}
                    >
                      {(
                        (hopper.filter((item) => {
                          return item.current_dept === route.id;
                        }).length /
                          route.cap) *
                        100
                      ).toFixed()}
                      %
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

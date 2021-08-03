import React, { useState, useEffect, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { StatusColor, StatusIndicator } from "../utils";
import axios from "axios";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import routes from "../routes/sidebar";
import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";
import ChartCard from "../components/Chart/ChartCard";

import {
  piData,
  taktTrackerData,
  defectLogData,
  defectCount,
  queueData,
  getOperatorCount,
  queueColorGenerator,
} from "../utils/dashboardData";
import { HopperContext } from "../context/HopperContext";
import { ScanModal } from "../components/ScanModal";
import { BuildSettings } from "../components/BuildSettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

function Production() {
  const dept_flow = {
    "-1": "Scheduler",
    0: "Nesting",
    1: "Laser",
    2: "Press Brake",
    3: "Slip Roll",
    4: "Tube Fab",
    5: "Tube Bender",
    6: "Saw",
    7: "Mill",
    8: "Lathe",
    9: "Welding",
    10: "Robot Welding",
    11: "Powder Coating",
    12: "Hardware",
    13: "Final Assembly",
    14: "Packaging",
    15: "Shipping",
  };

  const { hopper, operatorData, completedTakts, defectLog } =
    useContext(HopperContext);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const MakeHotCard = (id) => {
    console.log(id);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle>Production</PageTitle>
      </div>
      <div className="flex flex-row gap-2 m-2">
        {/* <button className="text-lg text-white bg-blue-400 rounded-lg shadow-lg p-2">
          Builds
        </button>
        <button className="text-lg text-white bg-blue-400 rounded-lg shadow-lg p-2">
          Capacity
        </button>
        <button className="text-lg text-white bg-blue-400 rounded-lg shadow-lg p-2">
          Takt Times
        </button> */}
      </div>

      <TableContainer>
        <div className="h-auto px-4 py-4 border-2 border-gray-300 m-2 rounded flex flex-col items-start text-center">
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableCell>Status</TableCell>
                <TableCell>Part</TableCell>
                <TableCell>Qty.</TableCell>
                <TableCell>Purchase Order</TableCell>
                <TableCell>Current Location</TableCell>
                <TableCell>Release Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hopper.map((parts, i) => {
                if (parts.current_dept == 100) {
                } else {
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
                      <TableCell
                        onClick={() => {
                          MakeHotCard(parts.id);
                        }}
                      >
                        {StatusIndicator(parts.takt_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start text-sm">
                          <p className="font-bold text-2xl">
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
                        <span className="text-lg font-semibold">
                          #{parts.sales_order}
                        </span>
                        <p className="text-sm font-semibold">
                          {parts.customer}
                        </p>
                        <p className="text-xs">{parts.id} </p>
                      </TableCell>
                      <TableCell>
                        <p>Dept: {dept_flow[parts.current_dept]}</p>
                        <p>Cell: {parts.current_cell}</p>
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

      {/* METRICS */}
      <div className="flex flex-col gap-2 m-2 ">
        {routes.map((route, i) => {
          if (
            route.name == "Dashboard" ||
            route.name == "Scheduler" ||
            route.name == "Nesting" ||
            route.name == "Production"
          ) {
          } else {
            return (
              <div className="rounded-lg border-3 border-gray-200">
                <h2 className="text-3xl px-2 font-semibold">{route.name}</h2>
                {/* Dept Dashboard Metrics */}
                {/* Dept Dashboard Metrics */}
                <Tabs className="border-2 border-gray-200 bg-white m-2 w-full p-2 rounded-lg shadow-lg">
                  <TabList>
                    <Tab>Today</Tab>
                    <Tab>Past Week</Tab>
                    <Tab>Custom</Tab>
                  </TabList>
                  {/* Today Tab */}
                  <TabPanel>
                    <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3 p-1 w-full">
                      <ChartCard size="text-xl mb-6" title={"Todays' Status"}>
                        <Pie
                          data={piData(
                            "today",
                            hopper,
                            defectLog.filter((defect) => {
                              return (
                                defect.defect_dept == route.id ||
                                defect.from_dept == route.id
                              );
                            }),
                            completedTakts,
                            route.id
                          )}
                          options={{
                            responsive: true,
                            cutoutPercentage: 0,
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                          }}
                        />
                      </ChartCard>
                      <ChartCard size="text-xl" title="Daily Takt Tracker">
                        <p className="text-sm mb-6">
                          Takt time of every product that moved through this
                          department today.
                        </p>
                        <Line
                          data={taktTrackerData(
                            "today",
                            completedTakts,
                            hopper,
                            route.id
                          )}
                          options={{
                            options: {
                              responsive: true,
                              tooltips: {
                                mode: "index",
                                intersect: false,
                              },
                              hover: {
                                mode: "nearest",
                                intersect: true,
                              },
                            },
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ChartCard>
                      <ChartCard size="text-xl" title="Daily Defect Log">
                        <div className="flex flex-row text-lg mb-6 text-xl">
                          <p
                            className="mr-2 px-2  text-white
                    bg-orange-500 rounded"
                          >
                            {defectCount(
                              "today",
                              defectLog.filter((defect) => {
                                return (
                                  defect.defect_dept == route.id ||
                                  defect.from_dept == route.id
                                );
                              })
                            )}
                          </p>
                          <p>Defects Today</p>
                        </div>
                        <Bar
                          data={defectLogData(
                            "today",
                            defectLog.filter((defect) => {
                              // more logic in here to determine what is "counted" as a defect.
                              return (
                                defect.defect_dept == route.id ||
                                defect.from_dept == route.id
                              );
                            })
                          )}
                          options={{
                            options: {
                              responsive: true,
                            },
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ChartCard>
                    </div>
                  </TabPanel>
                  {/* This Week Tab */}
                  <TabPanel>
                    <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3 p-1 w-full">
                      <ChartCard size="text-xl mb-6" title={"Weekly Status"}>
                        <Pie
                          data={piData(
                            "week",
                            hopper,
                            defectLog.filter((defect) => {
                              return (
                                defect.defect_dept == route.id ||
                                defect.from_dept == route.id
                              );
                            }),
                            completedTakts,
                            route.id
                          )}
                          options={{
                            responsive: true,
                            cutoutPercentage: 0,
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                          }}
                        />
                      </ChartCard>
                      <ChartCard size="text-xl" title="Weekly Takt Tracker">
                        <p className="text-sm mb-6">
                          Takt time of every product that moved through this
                          department this week.
                        </p>
                        <Line
                          data={taktTrackerData(
                            "week",
                            completedTakts,
                            hopper,
                            route.id
                          )}
                          options={{
                            options: {
                              responsive: true,
                              tooltips: {
                                mode: "index",
                                intersect: false,
                              },
                              hover: {
                                mode: "nearest",
                                intersect: true,
                              },
                            },
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ChartCard>
                      <ChartCard size="text-xl" title="Weekly Defect Log">
                        <div className="flex flex-row text-lg mb-6 text-xl">
                          <p
                            className="mr-2 px-2 font-semibold text-white
                    bg-orange-500 rounded"
                          >
                            {defectCount(
                              "week",
                              defectLog.filter((defect) => {
                                return (
                                  defect.defect_dept == route.id ||
                                  defect.from_dept == route.id
                                );
                              })
                            )}
                          </p>
                          <p>Weekly Defects</p>
                        </div>
                        <Bar
                          data={defectLogData(
                            "week",
                            defectLog.filter((defect) => {
                              // more logic in here to determine what is "counted" as a defect.
                              return (
                                defect.defect_dept == route.id ||
                                defect.from_dept == route.id
                              );
                            })
                          )}
                          options={{
                            options: {
                              responsive: true,
                            },
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ChartCard>
                    </div>
                  </TabPanel>
                  {/* Custom Tab */}
                  <TabPanel>
                    <div className="flex flex-col border-2 border-gray-300 p-4 m-2 rounded md:w-1/4 text-center">
                      <h2 className="text-2xl font-semibold">Set Date Range</h2>
                      <div className="flex flex-col items-center justify-center ">
                        <p className="text-lg">From </p>
                        <DatePicker
                          className="border-2 border-gray-300 bg-green-100 rounded "
                          selected={dateRange.from}
                          onChange={(date) => {
                            setDateRange({ ...dateRange, from: date });
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center ">
                        <p className="text-lg">To </p>
                        <DatePicker
                          className="border-2 border-gray-300 bg-red-100 rounded "
                          selected={dateRange.to}
                          onChange={(date) => {
                            setDateRange({ ...dateRange, to: date });
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3 p-1 w-full">
                      <ChartCard size="text-xl mb-6" title={"Custom Status"}>
                        <Pie
                          data={piData(
                            [dateRange.from, dateRange.to],
                            hopper,
                            defectLog.filter((defect) => {
                              return (
                                defect.defect_dept == route.id ||
                                defect.from_dept == route.id
                              );
                            }),
                            completedTakts,
                            route.id
                          )}
                          options={{
                            responsive: true,
                            cutoutPercentage: 0,
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                          }}
                        />
                      </ChartCard>
                      <ChartCard size="text-xl" title="Custom Takt Tracker">
                        <p className="text-sm mb-6">
                          Takt time of every product that moved through this
                          department in selected date range.
                        </p>
                        <Line
                          data={taktTrackerData(
                            [dateRange.from, dateRange.to],
                            completedTakts,
                            hopper,
                            route.id
                          )}
                          options={{
                            options: {
                              responsive: true,
                              tooltips: {
                                mode: "index",
                                intersect: false,
                              },
                              hover: {
                                mode: "nearest",
                                intersect: true,
                              },
                            },
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ChartCard>
                      <ChartCard size="text-xl" title="Custom Defect Log">
                        <div className="flex flex-row text-lg mb-6 text-xl">
                          <p
                            className="mr-2 px-2  text-white
                    bg-orange-500 rounded"
                          >
                            {defectCount(
                              [dateRange.from, dateRange.to],
                              defectLog.filter((defect) => {
                                return (
                                  defect.defect_dept == route.id ||
                                  defect.from_dept == route.id
                                );
                              })
                            )}
                          </p>
                          <p>Defects</p>
                        </div>
                        <Bar
                          data={defectLogData(
                            [dateRange.from, dateRange.to],
                            defectLog.filter((defect) => {
                              // more logic in here to determine what is "counted" as a defect.
                              return (
                                defect.defect_dept == route.id ||
                                defect.from_dept == route.id
                              );
                            })
                          )}
                          options={{
                            options: {
                              responsive: true,
                            },
                            legend: {
                              display: true,
                              position: "bottom",
                            },
                            scales: {
                              yAxes: [
                                {
                                  ticks: {
                                    beginAtZero: true,
                                    stepSize: 1,
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </ChartCard>
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

export default Production;

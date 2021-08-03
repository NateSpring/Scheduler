import React, { useState, useContext } from "react";
import { StatusIndicator, getOperatorsByDept } from "../utils";
import routes from "../routes/sidebar";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Pie, Bar, Line } from "react-chartjs-2";
import PageTitle from "../components/Typography/PageTitle";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "@windmill/react-ui";

import { HopperContext } from "../context/HopperContext";
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

function Dashboard() {
  const { hopper, operatorData, completedTakts, defectLog } =
    useContext(HopperContext);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* Dept status, with cell status */}
      {/* <PageTitle>Department Cell Status</PageTitle> */}
      {routes.map((route, i) => {
        if (
          route.name == "Dashboard" ||
          route.name == "Scheduler" ||
          route.name == "Nesting" ||
          route.name == "Production"
        ) {
        } else {
          return (
            <div className="flex flex-col mb-10 shadow-2xl bg-white rounded-xl border-2 border-gray-300">
              <div
                className="flex items-center justify-center 
          text-6xl font-bold 
          bg-gradient-to-r
          from-blue-500
          to-blue-500
          via-blue-900
          animate-gradient-x-slow
          rounded-none 
          rounded-t-lg 
          text-gray-50 dark:text-gray-200 text-center py-4 md:w-full

          "
              >
                <h2>{route.name}</h2>
              </div>

              <div
                key={route.id}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 "
              >
                <ChartCard size="text-3xl mb-6" title={"Status"}>
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
                  {/* <ChartLegend legends={doughnutLegends} /> */}
                </ChartCard>
                {/* Current Stats */}
                <div className="flex flex-col border border-gray-400 m-2 justify-center rounded-lg shadow">
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
                              return item.current_dept === route.id;
                            }).length,
                            route.cap
                          )}
                        </TableCell>
                      </TableRow>
                      {route.name == "Welding" && (
                        <TableRow className=" dark:bg-gray-700 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-600">
                          <TableCell className="border-b-2">
                            <span className="font-semibold mr-2 text-md">
                              Toolbox Capacity:
                            </span>
                          </TableCell>
                          <TableCell className="border-b-2">
                            <span
                              className={`text-4xl text-white font-semibold ${queueColorGenerator(
                                (
                                  (hopper.filter((item) => {
                                    return (
                                      item.current_dept === route.id ||
                                      item.current_cell === "TOOLBOX-1" ||
                                      item.current_cell === "TOOLBOX-2" ||
                                      item.current_cell === "TOOLBOX-3" ||
                                      item.current_cell === "TOOLBOX-4"
                                    );
                                  }).length /
                                    route.cap_toolbox) *
                                  100
                                ).toFixed(2)
                              )} px-2 rounded`}
                            >
                              {(
                                (hopper.filter((item) => {
                                  return (
                                    item.current_dept === route.id ||
                                    item.current_cell === "TOOLBOX-1" ||
                                    item.current_cell === "TOOLBOX-2" ||
                                    item.current_cell === "TOOLBOX-3" ||
                                    item.current_cell === "TOOLBOX-4"
                                  );
                                }).length /
                                  route.cap_toolbox) *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          </TableCell>
                        </TableRow>
                      )}
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
                                  route.id,
                                  operatorData.filter((operator) => {
                                    return (
                                      operator.operator !== "" &&
                                      operator.dept == route.id
                                    );
                                  }),
                                  hopper.filter((build) => {
                                    return build.current_dept == route.id;
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
                                  return build.current_dept == route.id;
                                })
                              )}
                              %
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                      {route.name === "Final Assembly" && (
                        <>
                          <TableRow className="dark:bg-gray-700 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-600">
                            <TableCell className="border-b-2">
                              <span className="font-semibold mr-2 text-md">
                                Dolly Capacity:
                              </span>
                            </TableCell>
                            <TableCell className="border-b-2">
                              <span
                                className={`text-4xl text-white font-semibold ${queueColorGenerator(
                                  (
                                    (hopper.filter((item) => {
                                      return (
                                        item.current_dept === route.id &&
                                        item.current_cell === "Dolly Assembly"
                                      );
                                    }).length /
                                      route.cap_dolly) *
                                    100
                                  ).toFixed(2)
                                )} px-2 rounded`}
                              >
                                {(
                                  (hopper.filter((item) => {
                                    return (
                                      item.current_dept === route.id &&
                                      item.current_cell === "Dolly Assembly"
                                    );
                                  }).length /
                                    route.cap_dolly) *
                                  100
                                ).toFixed(2)}
                                %
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow className="dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                            <TableCell className="border-b-2">
                              <span className="font-semibold mr-2 text-md">
                                Sidepuller Capacity:
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-4xl text-white font-semibold ${queueColorGenerator(
                                  (
                                    (hopper.filter((item) => {
                                      return (
                                        item.current_dept === route.id &&
                                        item.current_cell === "SP Assembly"
                                      );
                                    }).length /
                                      route.cap_sp) *
                                    100
                                  ).toFixed(2)
                                )} px-2 rounded`}
                              >
                                {(
                                  (hopper.filter((item) => {
                                    return (
                                      item.current_dept === route.id &&
                                      item.current_cell === "SP Assembly"
                                    );
                                  }).length /
                                    route.cap_sp) *
                                  100
                                ).toFixed(2)}
                                %
                              </span>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                      <TableRow className="dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                        <TableCell className="border-b-2">
                          <span className="font-semibold mr-2 text-md">
                            {route.name == "Laser"
                              ? "Current Nested Hours:"
                              : "Current Queue Hours:"}
                          </span>
                        </TableCell>
                        <TableCell className="border-b-2">
                          <span className="text-3xl text-white font-semibold bg-blue-500 px-2 rounded">
                            {queueData(
                              hopper.filter((item) => {
                                return item.current_dept === route.id;
                              })
                            )}
                          </span>
                        </TableCell>
                      </TableRow>

                      {route.name == "Laser" ? (
                        <></>
                      ) : (
                        <>
                          <TableRow className="dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                            <TableCell className="border-b-2">
                              <span className="font-semibold mr-2 text-md">
                                Man Hours:
                              </span>
                            </TableCell>
                            <TableCell className="border-b-2">
                              <span className="text-4xl text-white font-semibold bg-blue-500 px-2 rounded">
                                {getOperatorCount(
                                  operatorData.filter((cell) => {
                                    return (
                                      cell.dept === route.id &&
                                      cell.operator !== ""
                                    );
                                  })
                                )}
                              </span>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </TableContainer>
                </div>

                {/* TAKT TRACKER  */}
                {route.name !== "Laser" && (
                  <ChartCard size="text-3xl" title="Daily Takt Tracker">
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
                )}
                {/* DEFECT LOG */}
                <ChartCard size="text-3xl" title="Daily Defect Log">
                  <div className="flex flex-row text-lg mb-6 text-lg">
                    <p>Defects Today: </p>
                    <p
                      className="ml-2 px-2  text-white
                    bg-orange-500 rounded-xl"
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
            </div>
          );
        }
      })}
    </>
  );
}

export default Dashboard;

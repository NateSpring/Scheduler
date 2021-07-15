import React, { useState, useContext } from "react";
import { TaktStatusIndicator, getOperatorsByDept } from "../utils";
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
  queueData,
  getOperatorCount,
  queueColorGenerator,
} from "../utils/dashboardData";

function Dashboard() {
  const { hopper, operatorData, completedTakts, defectLog } =
    useContext(HopperContext);
  // console.log(hopper);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* Dept status, with cell status */}
      {/* <PageTitle>Department Cell Status</PageTitle> */}
      {routes.map((route, i) => {
        if (
          route.name == "Dashboard" ||
          route.name == "Scheduler" ||
          route.name == "Nesting"
        ) {
        } else {
          return (
            <div
              key={route.id}
              className="grid gap-6 mb-8 md:grid-cols-2 shadow-2xl bg-gray-50"
            >
              <ChartCard title={route.name}>
                <Pie
                  data={piData(
                    hopper.filter((item) => {
                      return item.current_dept === route.id;
                    })
                  )}
                  options={{
                    labels: ["On Time", "Stopped", "Waiting"],
                    options: {
                      responsive: true,
                      cutoutPercentage: 10,
                    },
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                  }}
                />
                {/* <ChartLegend legends={doughnutLegends} /> */}
                <TableContainer className="mt-6 flex flex-col items-center ">
                  <TableBody className="text-center ">
                    <TableRow className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600">
                      <TableCell>
                        <span className="font-semibold mr-2 text-xl">
                          Dept Capacity:
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-4xl text-white font-semibold ${queueColorGenerator(
                            (
                              (hopper.filter((item) => {
                                return item.current_dept === route.id;
                              }).length /
                                route.cap) *
                              100
                            ).toFixed(2)
                          )} px-2 rounded`}
                        >
                          {(
                            (hopper.filter((item) => {
                              return item.current_dept === route.id;
                            }).length /
                              route.cap) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </TableCell>
                    </TableRow>
                    {route.name == "Welding" && (
                      <TableRow className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600">
                        <TableCell>
                          <span className="font-semibold mr-2 text-xl">
                            Toolbox Capacity:
                          </span>
                        </TableCell>
                        <TableCell>
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
                    {route.name === "Final Assembly" && (
                      <>
                        <TableRow className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600">
                          <TableCell>
                            <span className="font-semibold mr-2 text-xl">
                              Dolly Capacity:
                            </span>
                          </TableCell>
                          <TableCell>
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
                        <TableRow className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600">
                          <TableCell>
                            <span className="font-semibold mr-2 text-xl">
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
                    <TableRow className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600">
                      <TableCell>
                        <span className="font-semibold mr-2 text-xl">
                          {route.name == "Laser"
                            ? "Current Nested Hours:"
                            : "Current Queue Hours:"}
                        </span>
                      </TableCell>
                      <TableCell>
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
                        <TableRow className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600">
                          <TableCell>
                            <span className="font-semibold mr-2 text-xl">
                              Man Hours:
                            </span>
                          </TableCell>
                          <TableCell>
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
              </ChartCard>
              {/* TAKT TRACKER  */}
              <ChartCard title="Daily Takt Tracker">
                <p className="text-sm mb-6">
                  Takt time of every product that moved through this department
                  today.
                </p>
                <Line
                  data={taktTrackerData(completedTakts, hopper, route.id)}
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
              {/* DEFECT LOG */}
              <ChartCard title="Daily Defect Log">
                <p className="text-sm mb-6">Defect count for today.</p>
                <Bar
                  data={defectLogData(
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
              {/* Dept Hopper Table */}
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Cell</TableCell>
                      <TableCell>Part</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Map in here for items in cells */}
                    {hopper.map((parts, i) => {
                      if (parts.current_dept === route.id) {
                        return (
                          <TableRow key={i}
                            className={`bg-${parts.takt_status}-500 text-gray-100 font-semibold text-lg`}
                          >
                            <TableCell>{parts.current_cell}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{parts.part_number}</span>
                                <span className="text-xs">
                                  {parts.customer}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {TaktStatusIndicator(parts.takt_status)}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          );
        }
      })}
    </>
  );
}

export default Dashboard;

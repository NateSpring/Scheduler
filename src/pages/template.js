<>
  <div className="flex flex-row items-center justify-between">
    <PageTitle>departmentidentifier</PageTitle>
  </div>
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
                  defect.defect_dept == departmentidentifier ||
                  defect.from_dept == departmentidentifier
                );
              }),
              completedTakts,
              departmentidentifier
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
            Takt time of every product that moved through this department today.
          </p>
          <Line
            data={taktTrackerData(
              "today",
              completedTakts,
              hopper,
              departmentidentifier
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
                    defect.defect_dept == departmentidentifier ||
                    defect.from_dept == departmentidentifier
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
                  defect.defect_dept == departmentidentifier ||
                  defect.from_dept == departmentidentifier
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
                  defect.defect_dept == departmentidentifier ||
                  defect.from_dept == departmentidentifier
                );
              }),
              completedTakts,
              departmentidentifier
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
            Takt time of every product that moved through this department this
            week.
          </p>
          <Line
            data={taktTrackerData(
              "week",
              completedTakts,
              hopper,
              departmentidentifier
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
                    defect.defect_dept == departmentidentifier ||
                    defect.from_dept == departmentidentifier
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
                  defect.defect_dept == departmentidentifier ||
                  defect.from_dept == departmentidentifier
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
                  defect.defect_dept == departmentidentifier ||
                  defect.from_dept == departmentidentifier
                );
              }),
              completedTakts,
              departmentidentifier
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
            Takt time of every product that moved through this department in
            selected date range.
          </p>
          <Line
            data={taktTrackerData(
              [dateRange.from, dateRange.to],
              completedTakts,
              hopper,
              departmentidentifier
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
                    defect.defect_dept == departmentidentifier ||
                    defect.from_dept == departmentidentifier
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
                  defect.defect_dept == departmentidentifier ||
                  defect.from_dept == departmentidentifier
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
          text-gray-50 dark:text-gray-200 text-center py-4 w-full
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
              parts.current_dept === departmentidentifier &&
              parts.current_cell === "hopper"
            ) {
              return (
                <TableRow
                  key={i}
                  className={`${StatusColor(parts.takt_status).light} hover:${
                    StatusColor(parts.takt_status).dark
                  }
                      text-white text-center
                      transition duration-250 ease-in-out transform 
                      hover:scale-98
                      `}
                >
                  <TableCell>{StatusIndicator(parts.takt_status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col justify-center text-sm">
                      <p className="font-bold text-lg">{parts.part_number}</p>
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
                    <p className="text-sm font-semibold">{parts.customer}</p>
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
                            Send to Cell: {cell}
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
                    <ScanModal scanDept={departmentidentifier} />
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hopper.map((parts, i) => {
                  if (
                    parts.current_dept === departmentidentifier &&
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
                                    Send to Cell: {cell}
                                  </option>
                                );
                              })}
                            </select>
                          </TableCell>

                          <TableCell>
                            <span className="text-lg">
                              {parts.release_date.split("-")[1]}-
                              {parts.release_date.split("-")[2].split("T")[0]}
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
</>;

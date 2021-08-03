import React, { useContext } from "react";
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
import { HopperContext } from "../context/HopperContext";
import { ScanModal } from "../components/ScanModal";
import { BuildSettings } from "../components/BuildSettings";
import { RecutList } from "../components/RecutList";

function Nesting() {
  const { hopper } = useContext(HopperContext);

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle>Nesting</PageTitle>
        <ScanModal scanDept={0} />
      </div>
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
                <TableCell>Release Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hopper.map((parts, i) => {
                if (
                  parts.current_dept === 0 &&
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
    </>
  );
}

export default Nesting;

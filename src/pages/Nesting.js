import React, { useContext } from "react";
import axios from "axios";
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
import { ScanModal } from "../components/ScanModal";

function Nesting() {
  const { hopper } = useContext(HopperContext);

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle>Nesting</PageTitle>
        <ScanModal scanDept={0} />
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
                <TableCell>Release Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hopper.map((parts, i) => {
                if (parts.current_dept === 0) {
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
                      <TableCell></TableCell>
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

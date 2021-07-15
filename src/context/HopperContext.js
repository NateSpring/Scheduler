import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:5000");

const HopperContext = createContext();

const HopperProvider = (props) => {
  const [departmentFlow, setDepartmentFlow] = useState([
    { 0: "Nesting" },
    { 1: "Laser" },
    { 2: "Press Brake" },
    { 3: "Tube Fab" },
    { 4: "Tube Bender" },
    { 5: "Saw" },
    { 6: "Mill" },
    { 7: "Lathe" },
    { 8: "Welding" },
    { 9: "Robotic Welding" },
    { 10: "Powder Coating" },
    { 11: "Hardware" },
    { 12: "Final Assembly" },
    { 13: "Packaging" },
    { 14: "Shipping" },
  ]);
  const [hopper, setHopper] = useState([]);
  const [completedTakts, setCompletedTakts] = useState([]);
  const [defectLog, setDefectLog] = useState([]);
  const [buildOrder, setNewCell] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operatorData, setOperatorData] = useState([]);

  useEffect(() => {
    // Rerender on socket emits
    socket.on("cell status changed", (data) => {
      console.log("Cell status Change: ", data);
      setHopper(
        hopper.map((item) =>
          item.id === data.id ? { ...item, current_cell: data.cell } : item
        )
      );
      setNewCell({
        pid: data.id,
        ccell: data.cell,
      });
    });
    socket.on("dept status change", (data) => {
      console.log("Build Status Change: ", data.message);
      setHopper(
        hopper.map((item) =>
          item.id === data.id ? { ...item, current_dept: data.dept } : item
        )
      );
      setNewCell({
        pid: data.id,
        dept: data.dept,
      });
      setOperatorData(
        operatorData.map((op) =>
          op.cell == data.cell ? { ...op, operator: data.operator } : op
        )
      );
    });
    return () => {
      socket.off("cell status changed", (data) => {
        console.log(data.message);
      });
      socket.off("dept status change", (data) => {
        console.log(data.message);
      });
    };
  }, []);

  // Rerender on hopper changes
  useEffect(() => {
    // Init current hopper for this department.
    const getHopper = async () => {
      let hopParse = [];
      let currentHopper = [];
      const hopRes = await axios.get(`http://localhost:5000/hopper`);
      const completedTakt = await axios.get(
        `http://localhost:5000/completed_takt_time`
      );
      const defects = await axios.get(`http://localhost:5000/defect_log`);
      hopRes.data.map((hop) => {
        hop.part_data = JSON.parse(hop.part_data);
        // Map takt times from here
        let taktTime = hop.part_data;
        hop.takt_data = {
          Laser: parseFloat(taktTime[2]),
          PressBrake: parseFloat(taktTime[9]) + parseFloat(taktTime[11]),
          TubeFab: parseFloat(taktTime[31]) + parseFloat(taktTime[37]),
          TubeBender: parseFloat(taktTime[39]) + parseFloat(taktTime[42]),
          Saw:
            parseFloat(taktTime[14]) == 0
              ? parseFloat(taktTime[18]) + parseFloat(taktTime[15])
              : parseFloat(taktTime[18]) +
                parseFloat(taktTime[15]) * parseFloat(taktTime[14]),
          Lathe: parseFloat(taktTime[20]) + parseFloat(taktTime[22]),
          Mill: parseFloat(taktTime[28]) + parseFloat(taktTime[30]),
          Welding: parseFloat(taktTime[47]) + parseFloat(taktTime[48]),
          RoboticWelding: parseFloat(taktTime[51]) + parseFloat(taktTime[52]),
          PowderCoating: parseFloat(taktTime[52]),
          Hardware: parseFloat(taktTime[59]),
          FinalAssembly: parseFloat(taktTime[62]) + parseFloat(taktTime[63]),
          //falsy for packaging
          Packaging: 10.1,
          Shipping: {
            rbo_b2: parseFloat(taktTime[66]),
            itd_b2: parseFloat(taktTime[67]),
            ffp_b2: parseFloat(taktTime[68]),
            itd_b1: parseFloat(taktTime[69]),
            rbo_b1: parseFloat(taktTime[70]),
            ffp_b1: parseFloat(taktTime[71]),
          },
        };
        // 'Tak' on completed takt.
        completedTakt.data.map((ct) => {
          if (ct.id == hop.id) {
            hop.completed_takt = ct;
          }
        });
        setDefectLog(defects.data);

        if (hop.current_cell === 0) {
          currentHopper.push(hop);
        }
        hopParse.push(hop);
      });
      /*currentHopper.length > 0 ? setEmptyHopper(false) : setEmptyHopper(true);*/
      setHopper(hopParse);
    };
    getHopper();
  }, [buildOrder]);

  // Initialize Operator Data:
  useEffect(() => {
    const getOperators = async () => {
      let cellOps = await axios.get("http://localhost:5000/get_operator");
      setOperatorData(cellOps.data);
    };
    getOperators();
  }, [buildOrder]);

  useEffect(() => {
    const getCompleteTakt = async () => {
      let ttd_data = await axios.get(
        "http://localhost:5000/completed_takt_time"
      );
      let ttd = ttd_data.data;
      setCompletedTakts(ttd);
    };
    getCompleteTakt();
  }, [buildOrder]);
  console.log(hopper);

  return (
    <HopperContext.Provider
      value={{
        departmentFlow,
        defectLog,
        hopper,
        setHopper,
        buildOrder,
        setNewCell,
        isModalOpen,
        setIsModalOpen,
        operatorData,
        setOperatorData,
        completedTakts,
        setCompletedTakts,
      }}
    >
      {props.children}
    </HopperContext.Provider>
  );
};

export { HopperProvider, HopperContext };

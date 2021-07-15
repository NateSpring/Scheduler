import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { HopperContext } from "../context/HopperContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ScanModalTimer = ({ taktTimerTime }) => {
  const {
    hopper,
    setHopper,
    cells,
    setCells,
    timer,
    setTimer,
    taktStatus,
    setTaktStatus,
    isModalOpen,
    setIsModalOpen,
    timerStatus,
    setTimerStatus,
    scanModalOpen,
    setScanModalOpen,
  } = useContext(HopperContext);

  const [qrOutput, setQrOutput] = useState("");
  useEffect(() => {
    const stillTypin = setTimeout(() => {
      qrOutput !== "" && scan(qrOutput);
    }, 500);
    return () => {
      clearTimeout(stillTypin);
    };
  }, [qrOutput]);

  const scan = async (buildOrderId) => {
    const movingOrder = await axios
      .post("http://localhost:5000/scan", {
        qrCode: buildOrderId,
        taktTime: taktTimerTime.time,
      })
      .then((res) => {
        console.log("Scan Successful", res.data);
        setIsModalOpen(false);
        toast.success(ToastMsg(buildOrderId));
        setQrOutput("");
      })
      .catch((err) => {
        console.log("Scan fail: ", err.response.data);
        toast.error(ToastErr(buildOrderId, err.response.data));
      });
  };
  const ToastMsg = (buildOrder) => (
    <div>
      <p className="text-xl font-bold">Scan Success!</p>
      <p className="font-semibold">Build Order:</p>
      <span> {buildOrder}</span>
    </div>
  );
  const ToastErr = (buildOrder, error) => (
    <div>
      <p className="text-xl font-bold">Scan Failure!</p>
      <p className="font-semibold">Build Order:</p>
      <span>{buildOrder}</span>
      <p className="font-semibold">Error:</p>
      <span> {error}</span>
    </div>
  );
  //// END REUSABLE QR SCAN OUT

  return (
    <>
      <input
        autoFocus
        className="p-4 border-4 rounded h-8  focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
        name="qrCode"
        value={qrOutput}
        onChange={(e) => {
          setQrOutput(e.target.value);
        }}
        type="text"
        placeholder="Scan to Stop Takt Timer"
      ></input>
      <button
        className="bg-yellow-300 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm"
        onClick={() => {
          setQrOutput("");
        }}
      >
        Clear
      </button>
    </>
  );
};

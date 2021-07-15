import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
} from "@windmill/react-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { HopperContext } from "../context/HopperContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ScanModal = ({ scanDept }) => {
  const { hopper, setHopper, cells, setCells } = useContext(HopperContext);
  const [timer, setTimer] = useState();
  const [startTime, setStartTime] = useState();
  const [timerStatus, setTimerStatus] = useState();
  const [taktStatus, setTaktStatus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [qrOutput, setQrOutput] = useState("");
  const [qrScanOut, setQrScanOut] = useState("");
  const [dejaVuWindow, setDejaVuWindow] = useState(false);
  const [dejaVu, setDejaVu] = useState(false);
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

  const status = {
    good: "green",
    waiting: "blue",
    behind: "red",
  };
  const ToastMsg = (buildOrder, message) => (
    <div>
      <FontAwesomeIcon icon={faQrcode} />
      <p className="text-xl font-bold">Scan Success!</p>
      <p className="font-semibold">Build Order:</p>
      <span> {buildOrder}</span>
      {message && (
        <>
          <p className="font-semibold">{message}</p>
        </>
      )}
    </div>
  );
  const ToastErr = (buildOrder, error) => (
    <div>
      <FontAwesomeIcon icon={faQrcode} />
      <p className="text-xl font-bold">Scan Failure!</p>
      <p className="font-semibold">Build Order:</p>
      <span>{buildOrder}</span>
      <p className="font-semibold">Error:</p>
      <span> {error}</span>
    </div>
  );

  useEffect(() => {
    const stillTypin = setTimeout(() => {
      qrOutput !== "" && scan(qrOutput);
      qrScanOut !== "" && scanOut(qrScanOut);
    }, 500);
    return () => {
      clearTimeout(stillTypin);
    };
  }, [qrOutput, qrScanOut]);

  const scan = async (buildOrderId) => {
    // Scan in/out build order
    // const getCurrentDept = await axios
    //   .post("http://localhost:5000/buildorder", { id: buildOrderId })
    //   .then(async (res) => {
    //     let curDept = res.data[0].current_dept;
    //     if (curDept === scanDept) {

    hopper.map(async (item) => {
      if (item.id === buildOrderId) {
        item.part_data.slice(78, 93).map((dept, i) => {
          if (i == parseInt(item.current_dept)) {
            if (dept.length >= 3) {
              setDejaVuWindow(true);
            }
          }
        });
      }
    });

    const movingOrder = await axios
      .post("http://localhost:5000/scan", {
        qrCode: buildOrderId,
        scanDept: scanDept,
      })
      .then((res) => {
        console.log("Scan In Successful", res.data);
        hopper.map(async (hop) => {
          if (hop.id === qrOutput) {
            await axios
              .get(
                `/localfolder?part=${hop.part_number}&desc=${hop.part_data[1]}`
                // THIS WILL OPEN THE SPECIFIC PDF->>>>>
                // NEED FOLDER NAME FORMATTING -- REMOVE SPACES FOR CONSISTENCY
                // &dept=${whatDept(hop.current_dept)}`
              )
              .then((response) => {
                if (hop.current_dept === 1) {
                  // if (response.data.pdfData) {
                  //   hop.cutList = formatCutList(response.data.pdfData);
                  //   let cutList = formatCutList(response.data.pdfData);
                  //   setHopper(
                  //     hopper.map((item) =>
                  //       item.id === qrOutput
                  //         ? { ...item, cutList: cutList }
                  //         : item
                  //     )
                  //   );
                  // }
                  noTimer(hop);
                } else if (hop.current_dept === 0) {
                  /* Omit this if you want the nesting scan window to stay open until you're actually done.
                      Super handy for bulk scanning build orders. */
                  setScanModalOpen(false);
                } else {
                  taktTimer(hop);
                }
              })
              .catch((err) => {
                console.log("Catching err from pdf opener: ", err);
                toast.error(ToastErr(buildOrderId, err.message));
              });
          }
        });
        toast.success(ToastMsg(buildOrderId));
        setQrOutput("");
      })
      .catch((err) => {
        console.log("Scan fail: ", err.response.data);
        toast.error(ToastErr(buildOrderId, err.response.data));
      });
    // } else {
    //   toast.error(
    //     ToastErr(buildOrderId, "Build Order Not In This Department!")
    //   );
    // }
    // });
  };

  const redAlertCall = async (dept, cell) => {
    await axios
      .post("/call", {
        dept: dept_flow[dept],
        cell: cell,
      })
      .then((res) => {
        console.log("red alert call made");
      });
  };

  /****  Pull data from cut list PDF ****/
  // const formatCutList = (cutListData) => {
  //   let pages = cutListData.pages;
  //   let numberOfParts = pages[0].texts[7].text;
  //   console.log(pages[0].texts[7].text);
  //   return numberOfParts;
  // };

  const scanOut = async (buildOrderId) => {
    hopper.map(async (item) => {
      if (item.id === buildOrderId) {
        var nextStep = 0;
        var nextDept = 0;

        item.part_data.slice(78, 93).map((dept, i) => {
          if (i == parseInt(item.current_dept)) {
            if (dejaVu == true) {
              nextStep = parseInt(dept.split(",")[1]) + 1;
            } else {
              nextStep = parseInt(dept) + 1;
            }
            console.log("NS: ", nextStep);
          }
        });

        item.part_data.slice(78, 93).map((dept, i) => {
          let multipass = dept.split(",");
          if (multipass.includes(nextStep.toString())) {
            nextDept = i;
          }
        });

        axios
          .post("http://localhost:5000/scan", {
            qrCode: buildOrderId,
            taktTime:
              timer.ms && startTime.ms ? msToHMS(startTime.ms - timer.ms) : 0,
            current_dept: item.current_dept,
            sales_order: item.sales_order,
            part_number: item.part_number,
            qty: item.quantity,
            nextDept: nextDept,
          })
          .then((res) => {
            console.log("Scan Out Successful", res.data);
            setScanModalOpen(false);
            setIsModalOpen({ mid: buildOrderId, open: false });
            toast.success(
              ToastMsg(buildOrderId, `Sending to: ${dept_flow[nextDept]}`)
            );
            setQrScanOut("");
          })
          .catch((err) => {
            console.log("Scan fail: ", err.response.data);
            toast.error(ToastErr(buildOrderId, err.response.data));
          });
      }
    });
  };

  useEffect(() => {
    if (timer) {
      const changeTaktStatus = async () => {
        const changeStatus = await axios
          .post(`http://localhost:5000/taktstatus`, {
            id: timer.uid,
            takt_status: timerStatus,
          })
          .then((response) => {
            console.log(response.data);
          });
      };
      changeTaktStatus();
    }
  }, [timerStatus]);

  ///////////////// Timer Function/////////////////////
  const taktTimer = (build) => {
    let partData = build.takt_data;
    //determine takt times from dept in here
    const flow = {
      0: "Nesting",
      1: "Laser",
      2: "PressBrake",
      3: "TubeFab",
      4: "TubeBender",
      5: "Saw",
      6: "Mill",
      7: "Lathe",
      8: "Welding",
      9: "RobotWelding",
      10: "PowderCoating",
      11: "Hardware",
      12: "FinalAssembly",
      13: "Packaging",
      14: "Shipping",
    };

    let deptTakt = flow[build.current_dept];
    let thisTakt = partData[deptTakt] * build.quantity;
    thisTakt = thisTakt.toFixed(2);
    let splitTakt = thisTakt.toString().split(".");
    let thisTaktMin = parseInt(splitTakt[0], 10) * 60 * 1000;
    let thisTaktSec = parseInt(splitTakt[1], 10) * 1000;

    console.log(
      `split:${splitTakt}, TaktMin: ${thisTaktMin}, TaktSec: ${thisTaktSec}`
    );

    thisTakt =
      (isNaN(thisTaktMin) ? 0 : thisTaktMin) +
      (isNaN(thisTaktSec) ? 0 : thisTaktSec);
    console.log("Takt Time: ", thisTakt);

    setTimer({ uid: build.id, ms: thisTakt, time: msToHMS(thisTakt) });
    setIsModalOpen({
      mid: build.id,
      open: true,
      current_dept: build.current_dept,
      current_cell: build.current_cell,
    });
    setTimerStatus(status.good);
    let ogTakt = thisTakt;
    setStartTime({
      uid: build.id,
      ms: ogTakt,
    });
    // Uncomment for takt time test.
    // thisTakt = 2000;
    const taktInterval = setInterval(() => {
      let thisTaktConvertSeconds = thisTakt / 1000;
      thisTaktConvertSeconds--;
      thisTakt = thisTaktConvertSeconds * 1000;

      setTimer({ uid: build.id, ms: thisTakt, time: msToHMS(thisTakt) });

      if (thisTakt < 0) {
        setTimerStatus(status.behind);
      }
    }, 1000);
  };

  // MS to H:M:S Converter
  function msToHMS(duration) {
    // 1- Convert to seconds:
    var seconds = duration / 1000;
    // 2- Extract hours:
    var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;

    let neg = false;
    if (seconds < 0 || minutes < 0 || hours < 0) {
      neg = true;
      seconds = Math.abs(seconds);
      minutes = Math.abs(minutes);
      hours = Math.abs(hours);
    }
    return neg
      ? "-" +
          (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds)
      : (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds);
  }
  const noTimer = (build) => {
    setTimer({ timer: 0 });
    setTimerStatus(status.good);
    setIsModalOpen({
      mid: build.id,
      open: true,
      noTimer: true,
      current_dept: build.current_dept,
      current_cell: build.current_cell,
    });
  };

  return (
    <>
      <button
        className="p-2 m-2 h-12 flex items-center justify-center bg-green-400 dark:bg-green-600 dark:hover:bg-green-900 hover:bg-green-500 rounded shadow-lg"
        onClick={() => {
          setScanModalOpen(true);
        }}
      >
        <div className="flex align-center items-center justify-center  p-1 rounded shadow-lg m-1 bg-gray-100">
          <FontAwesomeIcon className="" icon={faQrcode} />
        </div>
        <p className="font-semibold uppercase text-white">Scan Build Order</p>
      </button>

      {/* Scan modal */}
      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
        isOpen={scanModalOpen === true}
        onClose={() => {
          setScanModalOpen(false);
        }}
      >
        <ModalHeader className="flex flex-col items-center">
          <div>
            <FontAwesomeIcon className="p-0.5 mr-2" icon={faQrcode} />
            Scan Build Order
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-row justify-center items-center text-center">
          <input
            autoFocus
            className="p-4 border-4 rounded h-8  focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
            name="qrCode"
            value={qrOutput}
            onChange={(e) => {
              setQrOutput(e.target.value);
            }}
            type="text"
            placeholder="Scan QR Code"
          ></input>
          <button
            className="p-2 m-2 h-10 flex items-center justify-center bg-red-400 hover:bg-red-500 rounded hover:rounded-lg shadow-lg"
            onClick={() => {
              setQrOutput("");
            }}
          >
            <p className="font-semibold uppercase text-white">Clear</p>
          </button>
        </ModalBody>

        <ModalFooter>
          <div className="hidden sm:block">
            <Button
              layout="outline"
              onClick={() => {
                setScanModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      {/* timer modal */}
      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
        isOpen={isModalOpen.open === true}
        // onClose={() => {
        //   setIsModalOpen(false);
        // }}
      >
        <ModalHeader className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faStopwatch}
            size="lg"
            className={`text-${timerStatus}-500`}
          />
          {isModalOpen.noTimer ? "Order Complete?" : "Takt Timer"}
        </ModalHeader>
        {isModalOpen.noTimer ? (
          <ModalBody className="flex flex-col items-center text-center">
            <div className="mb-4 w-full">
              <p className="font-semibold text-lg">Build Order ID:</p>
              <div className={`pb-4 font-semibold text-${timerStatus}-500`}>
                {isModalOpen.mid}
              </div>

              {/* <div className="flex flex-row justify-center w-full bg-green-400 p-4 rounded text-xl text-center">
                <p className="text-3xl font-semibold mr-2 text-gray-100">
                  Completed:
                </p>
                <input
                  className="w-3/12 text-3xl font-semibold rounded pl-2"
                  type="number"
                  min="0"
                  max={isModalOpen.cutList}
                ></input>
                <p className="text-4xl font-semibold ml-4 text-gray-100">
                  / {isModalOpen.cutList}
                </p>
                <p className="text-sm font-semibold text-gray-100">parts</p>
              </div> */}
            </div>

            <div className="flex flex-row space-between w-full justify-center">
              <button
                className="bg-green-500 text-xl p-4 text-gray-100 font-bold rounded m-0.5 w-1/2"
                onClick={() => {
                  const qrso = document.getElementById("qr-scan-out");
                  qrso.focus();
                }}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-xl p-4 text-gray-100 font-bold rounded m-0.5 w-1/2"
                onClick={() => {
                  axios
                    .post("http://localhost:5000/timer_reset", {
                      id: isModalOpen.mid,
                    })
                    .then((res) => {
                      console.log(res);
                    });
                  setScanModalOpen(false);
                  setIsModalOpen(false);
                }}
              >
                No
              </button>
            </div>
          </ModalBody>
        ) : (
          <ModalBody className="flex flex-col items-center text-center">
            <p className="font-semibold py-4">Build Order ID:</p>
            <span className={`font-semibold text-${timerStatus}-500`}>
              {isModalOpen.mid}
            </span>
            <p className="hidden sm:block">
              The Takt Timer for this build order has begun. If you have to
              STOP: don't hesitate to "Pull the Cord" below.
            </p>
            <p className="block sm:hidden">
              The Takt Timer for this build order has begun. If you have to
              STOP: don't hesitate to "Pull the Cord" below. Since you're on a
              mobile device, switch to your camera and scan this build orders'
              QR Code to stop the takt timer.
            </p>
            <p
              className={`bg-${timerStatus}-500 px-6 py-4 mt-4 text-white rounded-lg text-6xl w-full`}
            >
              {timer ? timer.time : "No Takt Data Available"}
            </p>
          </ModalBody>
        )}
        <ModalFooter>
          <input
            autoFocus
            className=" p-4 border-4 rounded h-8  focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-500"
            name="qrCode"
            id="qr-scan-out"
            value={qrScanOut}
            onChange={(e) => {
              setQrScanOut(e.target.value);
            }}
            type="text"
            placeholder={`${
              isModalOpen.noTimer ? "Scan When Done" : "Scan to Stop Takt Timer"
            }`}
          ></input>
          <button
            className="bg-yellow-300 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm"
            onClick={() => {
              setQrScanOut("");
            }}
          >
            Clear
          </button>
          {dejaVuWindow === true && (
            <button
              className="bg-purple-400 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-1 rounded-lg text-sm"
              onClick={() => {
                setDejaVu(true);
              }}
            >
              2nd Time Here?
            </button>
          )}
          <div className="hidden sm:block">
            <button
              className="bg-red-500 text-white align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm uppercase"
              onClick={() => {
                setTimerStatus(status.behind);
                setIsModalOpen(false);
                setScanModalOpen(false);
                redAlertCall(
                  isModalOpen.current_dept,
                  isModalOpen.current_cell
                );
                toast.error("🚨 RED TEAM ASSEMBLE! 🚨");
              }}
            >
              Pull the Cord
            </button>
          </div>
          {/* <div className="hidden sm:block">
          <Button
            layout="outline"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div> */}
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              onClick={() => {
                setTimerStatus(status.behind);
                setIsModalOpen(false);
                setScanModalOpen(false);
                redAlertCall(
                  isModalOpen.current_dept,
                  isModalOpen.current_cell
                );
                toast.error("🚨 RED TEAM ASSEMBLE! 🚨");
              }}
            >
              Pull the Cord
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

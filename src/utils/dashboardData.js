import { IoCartSharp, IoCartOutline } from "react-icons/io5";
import moment from "moment";

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

const timeFilter = (filter) => {
  let filterStart, filterEnd;
  if (filter == "today") {
    filterStart = moment().format("YYYY-MM-DD");
    filterEnd = moment().format("YYYY-MM-DD");
  } else if (filter == "week") {
    filterStart = moment().format("YYYY-MM-DD");
    filterEnd = moment(filterStart)
      .subtract(1, "weeks")
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
  } else {
    filterStart = moment(filter[1]).format("YYYY-MM-DD");
    filterEnd = moment(filter[0]).format("YYYY-MM-DD");
  }
  return { filterStart, filterEnd };
};

// PI-CHART DATA
export const piData = (filter, items, defects, completedTakts, deptIndex) => {
  let dept = flow[deptIndex];
  let onTime = 0;
  let late = 0;
  let completed = 0;
  let defect = 0;
  // console.log(completedTakts);
  defects.map((d) => {
    if (
      moment(d.timestamp).format("YYYY-MM-DD") <=
        timeFilter(filter).filterStart &&
      moment(d.timestamp).format("YYYY-MM-DD") >= timeFilter(filter).filterEnd
    ) {
      defect++;
    }
  });

  completedTakts.map((completedTakt) => {
    if (completedTakt[dept] !== "0") {
      if (
        moment(completedTakt.timestamp).format("YYYY-MM-DD") <=
          timeFilter(filter).filterStart &&
        moment(completedTakt.timestamp).format("YYYY-MM-DD") >=
          timeFilter(filter).filterEnd
      ) {
        completed++;

        items.map((item) => {
          if (item.id == completedTakt.id) {
            if (completedTakt[dept] !== "0") {
              let item_takt = item.takt_data[dept] * item.quantity;
              let completed_takt = completedTakt[dept].split(":");
              let completed_time =
                (completed_takt[0] * 3600 +
                  completed_takt[1] * 60 +
                  +completed_takt[2]) /
                60;
              if (completed_time > item_takt) {
                late++;
              } else {
                onTime++;
              }
            }
          }
        });
      }
    }
  });

  // If nothing has flowed, ever; set placeholder of one complete
  if (onTime == 0 && late == 0 && completed == 0 && defect == 0) {
    completed = 0.1;
  }

  return {
    datasets: [
      {
        data: [onTime, late, completed, defect],
        backgroundColor: ["#10B981", "#DC2626", "#07c1f0", "#FF7605"],
        label: "Takt",
        hoverOffset: 4,
      },
    ],
    labels: ["On Time", "Late", "Completed", "Defect"],
    options: {
      responsive: true,
      cutoutPercentage: 10,
    },
    legend: {
      display: true,
      position: "bottom",
    },
  };
};

// TAKT DATA
export const taktTrackerData = (filter, completedTakts, items, deptIndex) => {
  let partNumber = [];
  let customer = [];
  let projected = [];
  let actual = [];
  let dept = flow[deptIndex];

  completedTakts.map((completedTakt) => {
    items.map((item) => {
      if (completedTakt.id === item.id) {
        if (completedTakt[dept] !== "0") {
          if (
            moment(completedTakt.timestamp).format("YYYY-MM-DD") <=
              timeFilter(filter).filterStart &&
            moment(completedTakt.timestamp).format("YYYY-MM-DD") >=
              timeFilter(filter).filterEnd
          ) {
            if (item.takt_data[dept] !== 0) {
              projected.push(item.takt_data[dept] * item.quantity);
              partNumber.push(item.part_number);
              customer.push(item.customer);
            }
            let completed_takt = completedTakt[dept].split(":");
            let completed_time =
              (completed_takt[0] * 3600 +
                completed_takt[1] * 60 +
                +completed_takt[2]) /
              60;
            completed_time = completed_time.toFixed(2);
            actual.push(completed_time);
          }
        }
      }
    });
  });
  return {
    labels: partNumber,
    datasets: [
      {
        label: "Actual",
        backgroundColor: "#10B981",
        borderColor: "#10B981",
        data: actual,
        fill: false,
      },
      {
        label: "Projected",
        backgroundColor: "#b92c10",
        borderColor: "#b92c10",
        data: projected,
        fill: false,
      },
    ],
  };
};

// DEFECT DATA
export const defectLogData = (filter, defectData) => {
  let defectArr = [];
  let defectCount = {};
  defectData.map((defect) => {
    if (
      moment(defect.timestamp).format("YYYY-MM-DD") <=
        timeFilter(filter).filterStart &&
      moment(defect.timestamp).format("YYYY-MM-DD") >=
        timeFilter(filter).filterEnd
    ) {
      defectArr.push(defect.part_number);
    }
  });

  defectArr.map((defect) => {
    defectCount[defect] = defectCount[defect] ? defectCount[defect] + 1 : 1;
  });
  return {
    labels: Object.keys(defectCount),
    datasets: [
      {
        label: "Defects",
        backgroundColor: "#ed8936",
        borderWidth: 2,
        data: Object.values(defectCount),
      },
    ],
  };
};

export const defectCount = (filter, defectData) => {
  let defectCount = 0;
  defectData.map((defect) => {
    if (
      moment(defect.timestamp).format("YYYY-MM-DD") <=
        timeFilter(filter).filterStart &&
      moment(defect.timestamp).format("YYYY-MM-DD") >=
        timeFilter(filter).filterEnd
    ) {
      defectCount++;
    }
  });
  return defectCount;
};

export const queueData = (items) => {
  let queueTime = 0;

  items.forEach((item) => {
    queueTime += item.takt_data[flow[item.current_dept]] * item.quantity;
  });

  let duration = queueTime * 60000;
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  let neg = false;
  if (seconds < 0 || minutes < 0 || hours < 0) {
    neg = true;
    seconds = Math.abs(seconds);
    minutes = Math.abs(minutes);
    hours = Math.abs(hours);
  }
  if (isNaN(hours, minutes, seconds)) {
    return "No Data";
  } else {
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
};
export const queueColorGenerator = (percentage) => {
  if (percentage >= 90) {
    return "bg-red-500";
  } else if (percentage >= 50) {
    return "bg-green-500";
  } else if (percentage <= 49) {
    return "bg-blue-500";
  }
};
export const progressLength = (percentage) => {
  if (percentage >= 100) {
    return `px-2 bg-red-700 animate-wiggle-light w-full`;
  } else if (percentage >= 90) {
    return `px-2 bg-gradient-to-r from-red-500 to-red-900 animate-gradient-xy-fast w-[${percentage}%]`;
  } else if (percentage >= 80) {
    return `px-2 bg-gradient-to-r from-red-500 to-red-600 w-[${percentage}%]`;
  } else if (percentage >= 70) {
    return `px-2 bg-gradient-to-r from-orange-500 to-red-500 animate-gradient-xy-fast w-[${percentage}%]`;
  } else if (percentage >= 60) {
    return `px-2 bg-gradient-to-r from-yellow-500 to-orange-500  w-[${percentage}%]`;
  } else if (percentage >= 50) {
    return `px-2 bg-gradient-to-r from-green-400 to-green-500 animate-gradient-x-fast w-[${percentage}%]`;
  } else if (percentage >= 40) {
    return `px-2 bg-blue-500 w-[${percentage}%]`;
  } else if (percentage >= 30) {
    return `px-2 bg-blue-500 w-[${percentage}%]`;
  } else if (percentage >= 20) {
    return `px-2 bg-blue-500 w-[${percentage}%]`;
  } else if (percentage >= 10) {
    return `px-2 bg-blue-500 w-[${percentage}%]`;
  } else if (percentage >= 0) {
    return `px-2 bg-blue-500 w-[${percentage}%]`;
  }
  // future JIT percentage
  // return `bg-blue-500 w-[${percentage}]`;
};

export const getOperatorCount = (operators) => {
  return operators.length * 8;
};

export const getSchedulerCapacity = (deptId, operatorCount, builds) => {
  let dept = flow[deptId];
  let scheduledMins = 0;

  builds.map((build) => {
    let buildMins = build.takt_data[dept] * build.quantity;
    if (isNaN(buildMins) == false) {
      scheduledMins += buildMins;
    }
  });

  let deptMinsAvail = operatorCount.length * 8 * 60;
  let deptCapPerc = (scheduledMins / deptMinsAvail) * 100;

  // console.log(
  //   dept,
  //   deptId,
  //   "-- op count:",
  //   operatorCount,
  //   "--Avail Mins:",
  //   deptMinsAvail,
  //   "--Sched Mins:",
  //   scheduledMins
  // );
  deptCapPerc = deptCapPerc.toFixed();
  if (deptCapPerc == "Infinity" || deptCapPerc == "NaN") {
    deptCapPerc = "N/A";
  }
  return deptCapPerc;
};

export const cartCap = (currentCartCount, totalCartCap) => {
  let carts = [];
  let cartsLeft = [];
  for (let i = 0; i < currentCartCount; i++) {
    carts.push(<IoCartSharp className="text-black text-3xl" />);
  }
  for (let cl = 0; cl < totalCartCap - currentCartCount; cl++) {
    cartsLeft.push(
      <IoCartOutline className="text-black opacity-25 text-3xl" />
    );
  }

  return (
    <div className="flex flex-row flex-wrap p-4 bg-gray-200 rounded gap-4">
      {carts}
      {cartsLeft}
    </div>
  );
};

// PLUGIN FOR INNER DOUGHNUT TEXT
// plugins={[
//   {
//     beforeDraw: function (chart) {
//       var width = chart.width,
//         height = chart.height,
//         ctx = chart.ctx;
//       ctx.restore();
//       var fontSize = (height / 92).toFixed(2);
//       ctx.fillStyle = "#1A1C23";
//       ctx.font = fontSize + "em sans-serif";
//       ctx.fontStyle = "bold";
//       ctx.textBaseline = "top";
//       var text = `${
//           (hopper.filter((item) => {
//             return item.current_dept === route.id;
//           }).length /
//             route.cap) *
//             100 || 0
//         }%`,
//         textX = Math.round(
//           (width - ctx.measureText(text).width) / 2
//         ),
//         textY = height / 2;

//       ctx.fillText(text, textX, textY);
//       ctx.save();
//     },
//   },
// ]}

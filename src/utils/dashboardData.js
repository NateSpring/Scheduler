export const piData = (items) => {
  let onTime = 0;
  let stopped = 0;
  let waiting = 0;

  items.map(
    (item) => (
      item.takt_status === "green" ? onTime++ : onTime,
      item.takt_status === "red" ? stopped++ : stopped,
      item.takt_status === "blue" ? waiting++ : waiting
    )
  );
  if (onTime == 0 && stopped == 0 && waiting == 0) {
    waiting = 1;
  }
  return {
    datasets: [
      {
        data: [onTime, stopped, waiting],
        backgroundColor: ["#10B981", "#DC2626", "#1c64f2"],
        label: "Takt",
        hoverOffset: 4,
      },
    ],
    labels: ["On Time", "Stopped", "Waiting"],
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

export const taktTrackerData = (completedTakts, items, deptIndex) => {
  let partNumber = [];
  let customer = [];
  let projected = [];
  let actual = [];
  const flow = {
    0: "Nesting",
    1: "Laser",
    2: "PressBrake",
    3: "SlipRoll",
    4: "TubeFab",
    5: "TubeBender",
    6: "Saw",
    7: "Mill",
    8: "Lathe",
    9: "Welding",
    10: "RobotWelding",
    11: "PowderCoating",
    12: "Hardware",
    13: "FinalAssembly",
    14: "Packaging",
    15: "Shipping",
  };
  let dept = flow[deptIndex];
  completedTakts.map((completedTakt) => {
    items.map((item) => {
      if (completedTakt.id === item.id) {
        if (completedTakt[flow[deptIndex]] !== "0") {
          if (item.takt_data[dept] !== 0) {
            projected.push((item.takt_data[dept] * item.quantity).toFixed(2));
            partNumber.push(item.part_number);
            customer.push(item.customer);
          }
          let completed_takt = completedTakt[flow[deptIndex]].split(":");
          let completed_time =
            (completed_takt[0] * 3600 +
              completed_takt[1] * 60 +
              +completed_takt[2]) /
            60;
          completed_time = completed_time.toFixed(2);
          actual.push(completed_time);
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
        fill: false,
        backgroundColor: "white",
        borderColor: "black",
        data: projected,
      },
    ],
  };
};
export const defectLogData = (defectData) => {
  let defectArr = [];
  let defectCount = {};
  defectData.map((defect) => {
    defectArr.push(defect.part_number);
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
export const queueData = (items) => {
  let queueTime = 0;
  const flow = {
    0: "Nesting",
    1: "Laser",
    2: "PressBrake",
    3: "SlipRoll",
    4: "TubeFab",
    5: "TubeBender",
    6: "Saw",
    7: "Mill",
    8: "Lathe",
    9: "Welding",
    10: "RobotWelding",
    11: "PowderCoating",
    12: "Hardware",
    13: "Final Assembly",
    14: "Packaging",
    15: "Shipping",
  };

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
    return "bg-red-500 w-full";
  } else if (percentage >= 90) {
    return "bg-red-500 w-10/12";
  } else if (percentage >= 80) {
    return "bg-red-500 w-9/12";
  } else if (percentage >= 70) {
    return "bg-red-500 w-8/12";
  } else if (percentage >= 60) {
    return "bg-red-500 w-7/12";
  } else if (percentage >= 50) {
    return "bg-green-500 w-6/12";
  } else if (percentage >= 40) {
    return "bg-blue-500 w-5/12";
  } else if (percentage >= 30) {
    return "bg-blue-500 w-4/12";
  } else if (percentage >= 20) {
    return "bg-blue-500 w-3/12";
  } else if (percentage >= 10) {
    return "bg-blue-500 w-2/12";
  } else if (percentage >= 0) {
    return "bg-blue-500 w-1/12";
  }
};

export const getOperatorCount = (dept) => {
  return dept.length * 8;
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

import { HopperContext } from "../../context/HopperContext";

export const doughnutLegends = [
  { title: "On Time", color: "bg-green-500" },
  { title: "Stopped", color: "bg-red-600" },
  { title: "Waiting", color: "bg-blue-600" },
];

export const lineLegends = [
  { title: "Projected", color: "bg-teal-600" },
  { title: "Actual", color: "bg-purple-600" },
];

export const barLegends = [
  { title: "Takt", color: "bg-teal-600" },
  { title: "Current", color: "bg-purple-600" },
];

export const doughnutOptions = {
  data: {
    datasets: [
      {
        data: [60, 15, , 10],
        backgroundColor: ["#10B981", "#FCD34D", "#1c64f2"],
        label: "Dataset 1",
      },
    ],
    labels: ["Good", "Stopped", "Waiting"],
  },
  options: {
    responsive: true,
    cutoutPercentage: 20,
  },
  legend: {
    display: false,
  },
};

export const lineOptions = {
  data: {
    labels: [
      "8am",
      "9am",
      "10am",
      "11am",
      "12pm",
      "1pm",
      "2pm",
      "3pm",
      "4pm",
      "5pm",
      "6pm",
      "7pm",
      "8pm",
    ],
    datasets: [
      {
        label: "Projected",
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: "#0694a2",
        borderColor: "#0694a2",
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
      {
        label: "Actual",
        fill: false,
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: "#7e3af2",
        borderColor: "#7e3af2",
        data: [24, 50, 64, 74, 52, 51, 65],
      },
    ],
  },
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
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Month",
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Value",
        },
      },
    },
  },
  legend: {
    display: false,
  },
};

export const barOptions = {
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Shoes",
        backgroundColor: "#0694a2",
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [-3, 14, 52, 74, 33, 90, 70],
      },
      {
        label: "Bags",
        backgroundColor: "#7e3af2",
        // borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [66, 33, 43, 12, 54, 62, 84],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
};

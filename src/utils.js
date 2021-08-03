import socketIOClient from "socket.io-client";
import { Badge } from "@windmill/react-ui";
import HotCard from "../src/assets/img/hot-icon.png";
import RecutCard from "../src/assets/img/hot-recut-icon.png";

//Functions for emiting state through socket.io//
const socket = socketIOClient("http://192.168.55.26:5000");
// Date time function
function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  // return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
  return hour + ":" + min + ":" + sec;
}

export const sendToCell = (targetId, newCell) => {
  socket.emit("cell status", {
    id: targetId,
    cell: newCell,
  });
};

export const sendToDept = (targetId, newDept) => {
  socket.emit("dept status", {
    id: targetId,
    dept: newDept,
  });
};

export const StatusIndicator = (status) => {
  if (status === "blue") {
    return (
      <Badge
        className="m-2 p-2 font-semibold text-md uppercase bg-blue-300"
        type="neutral"
      >
        Waiting
      </Badge>
    );
  } else if (status === "red") {
    return (
      <Badge className="m-2 p-2 font-semibold text-md uppercase" type="danger">
        Behind
      </Badge>
    );
  } else if (status === "green") {
    return (
      <Badge className="m-2 p-2 font-semibold text-md uppercase" type="success">
        On Time
      </Badge>
    );
  } else if (status === "orange") {
    return (
      <Badge className="m-2 p-2 font-semibold text-md uppercase" type="danger">
        Defect
      </Badge>
    );
  } else if (status === "hot") {
    return (
      <div className="w-full flex justify-center items-center">
        <img
          className="animate-wiggle-light"
          src={HotCard}
          width="75px"
          height="75px"
        />
      </div>
    );
  } else if (status === "recut") {
    return (
      <div className="w-full flex justify-center items-center">
        <img
          className="animate-wiggle-crack"
          src={RecutCard}
          width="75px"
          height="75px"
        />
      </div>
    );
  }
};

export const StatusColor = (status) => {
  if (status === "blue") {
    return { light: "bg-blue-500", dark: "bg-blue-600" };
  } else if (status === "red") {
    return { light: "bg-red-500", dark: "bg-red-600" };
  } else if (status === "green") {
    return { light: "bg-green-500", dark: "bg-green-600" };
  } else if (status === "orange") {
    return { light: "bg-orange-500", dark: "bg-orange-600" };
  } else if (status === "hot") {
    return {
      light:
        "bg-gradient-to-r from-red-500 to-red-800  animate-gradient-xy-superfast",
    };
  } else if (status === "recut") {
    return {
      light:
        "bg-gradient-to-r from-blue-400 to-blue-900 text-white animate-gradient-x-fast",
    };
  } else if (status === "undefined") {
    return {
      light: "bg-gray-300",
    };
  }
};

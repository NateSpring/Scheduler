import socketIOClient from "socket.io-client";
import { Badge } from "@windmill/react-ui";

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

export const TaktStatusIndicator = (status) => {
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
  }
};

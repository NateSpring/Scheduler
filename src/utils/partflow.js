import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";

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

export const PartFlow = ({ buildData }) => {
  let curDept = buildData.current_dept;

  return buildData.part_data.slice(78, 94).map((partData, i) => {
    if (curDept === i) {
      return partData;
    }
  });
};

export const BuildOrderPartFlow = ({ buildData }) => {
  return buildData.part_data.slice(78, 94).map((partData, i) => {
    if (partData == "") {
      return (
        <div className="text-gray-400 bg-gray-300 p-3  rounded-lg flex flex-row justify-center items-center">
          {dept_flow[i]}
        </div>
      );
    } else {
      return (
        <div
          className={` ${
            buildData.current_dept > i ? "bg-green-400" : "bg-blue-400"
          } text-gray-50  p-3 rounded-lg shadow-lg flex flex-row justify-center items-center`}
        >
          {buildData.current_dept > i && (
            <FontAwesomeIcon icon={faCheckSquare} className="mr-1 text-lg" />
          )}
          {dept_flow[i]}
        </div>
      );
    }
  });
};

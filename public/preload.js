window.require = require;

const { shell } = require("electron");

const dept_flow = {
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

window.open = function open(part, desc) {
  let partsLibrary = part + " " + desc;
  partsLibrary = partsLibrary.replace(/\s+/g, "-");
  shell.openPath(`\\\\ig\\Inventive\\Parts-Library\\${partsLibrary}`);
};

window.openfile = function openfile(part, desc, dept) {
  let partsLibrary = part + " " + desc;
  partsLibrary = partsLibrary.replace(/\s+/g, "-");
  console.log("opening .jpg");
  shell.openPath(
    `\\\\ig\\Inventive\\Parts-Library\\${partsLibrary}\\${desc}-${dept_flow[dept]}.jpg`
  );
};

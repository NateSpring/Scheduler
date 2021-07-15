//Required server packages//
const express = require("express");
const http = require("http");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
let fs = require("fs");
const localfs = require("child_process");
let PDFParser = require("pdf2json");
let pdfPar = require("pdf-parser");
const pdf2html = require("pdf2html");
const accountSid = "ACe66e026b9ced1fc9dc5bdd5a4978827c";
const authToken = "3bc8ff9fe05c66a24b8f050cf8316bcf";
const client = require("twilio")(accountSid, authToken);
const nodemailer = require("nodemailer");
const { GoogleSpreadsheet } = require("google-spreadsheet");

//Express setup and socket middleware//
const port = 5000;
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
const io = new socketIo.Server(server, {
  cors: {
    origin: "*",
  },
});

//MySQL config//
const config = {
  host: "127.0.0.1",
  user: "root",
  database: "dept_status",
};
const con = mysql.createPool(config);

// gSheet Setup

//Socket.IO setup//
let countSocketConnections = 0;
io.on("connection", (socket) => {
  /* 
  === 6-11/6-14 ===
  Socket Issue: multiple connections up to 300.
  Cause: Calling 'socketIOClient' within component. 
  Solution: Move to outside of component to prevent multiple connections.
  */

  countSocketConnections++;
  console.log(
    "Users Connected: Total Users --",
    countSocketConnections,
    "--",
    socket.id
  );
  socket.setMaxListeners(0);
  //Listen for emission of changing data//

  // Hopper status change from SendToDept funciton
  socket.on("cell status", (data) => {
    io.sockets.emit("cell status changed", data);
    console.log("SS: Cell Changing: ", data);
  });

  socket.on("dept status", (data) => {
    io.sockets.emit("dept status changed", data);
    console.log("SS:Dept Changing: ", data);
  });

  socket.on("disconnect", () => {
    countSocketConnections--;
    console.log(
      "User disconnected: Total Users --",
      countSocketConnections,
      "--",
      socket.id
    );
    socket.removeAllListeners();
  });

  /*Things seem much speedier with this ON */
  socket.off("cell status", (data) => {
    console.log(data.message);
  });
  socket.off("dept status", (data) => {
    console.log(data.message);
  });
});

/*****API ROUTES*****/
// Automated Calling with red alert data {dept, cell}
app.post("/call", (req, res) => {
  client.calls
    .create({
      twiml: `<Response><Say>Red Alert from ${req.body.dept} department, cell ${req.body.cell}</Say></Response>`,
      to: "+12096946171",
      from: "+19014109294",
    })
    .then((call) => console.log(call.sid))
    .then((res) => {
      res.status(200);
    });
});

// List all department states
app.get("/depts", (req, res) => {
  con.query("SELECT * from dept", (error, result) => {
    res.send(result);
  });
});

// Automated Email Notifications
app.get("/nm", (req, res) => {
  const transporter = nodemailer.createTransport({
    port: 25,
    host: "localhost",
    tls: {
      rejectUnauthorized: false,
    },
  });
  let message = {
    from: "Scheduler@itdscheduler.com",
    to: "nates@inventive-group.com",
    subject: "Red Alert",
    text: "Red alert at some sort of cell",
    html: "<h2>RED ALERT</h2>",
  };
  transporter.sendMail(message, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
});

//Exclusive Scheduler endpoint for creating build order
app.post("/create_build", (req, res) => {
  console.log(req.body);
  let part_data_query = `SELECT item from takt_time WHERE part_number='${req.body.part}'`;
  con.query(part_data_query, (error, result) => {
    try {
      let part_data = result[0].item;
      let create_build = `INSERT INTO hopper (id, sales_order, customer, part_number, quantity, current_dept, current_cell, timer_start, release_date, part_data, takt_status )
    VALUES ('${req.body.qrCode}', ${req.body.salesNumber}, '${req.body.customerName}', '${req.body.part}', ${req.body.quantity}, '-1', 'hopper', 1, '${req.body.release}', '${part_data}', 'blue')`;
      // Create Build Order when part data is available.
      con.query(create_build, (error, result) => {
        if (!error) {
          res.sendStatus(200);
          io.sockets.emit("dept status change", {
            id: req.body.qrCode,
            message: `Inserting ${req.body.qrCode} to Nesting...`,
          });
        }
      });
    } catch (e) {
      triggerError(e);
    }
  });
  const triggerError = (e) => {
    res.send({ status: "error", message: "Part Number Not Found" });
  };
});
////////////////////  TEST ZONE   ////////////////////////
app.post("/reset", (req, res) => {
  let test_reset = `UPDATE hopper SET current_dept=-1, timer_start=1, current_cell='hopper', takt_status='blue' WHERE id='${req.body.qrCode}'`;
  con.query(test_reset, (error, result) => {
    if (!error) {
      console.log(`\x1b[31m RESET:  ${req.body.qrCode} \x1b[0m`);
      io.sockets.emit("dept status change", {
        id: req.body.qrCode,
        message: `RESET ${req.body.qrCode}.`,
      });
    }
  });
  let reset_completed_takt = `UPDATE completed_takt_time SET laser=0, press_brake=0, machine_shop=0, tube_fab=0, welding=0, powder_coating=0, shipping=0`;
  con.query(reset_completed_takt, (error, result) => {
    if (!error) {
      console.log(
        `\x1b[31m RESET LOGGED TAKT TIME:  ${req.body.qrCode} \x1b[0m`
      );
      io.sockets.emit("dept status change", {
        id: req.body.qrCode,
        message: `RESET ${req.body.qrCode}.`,
      });
    }
  });
});
////////////////////////////////////////////////////////

// LOG TAKT TIME
const logTaktTime = (id, sales_order, part_number, qty, time, currentDept) => {
  console.log(
    `\x1b[35m Logged Takt Time for ${id} on scan out:  ${time} at ${currentDept} \x1b[0m`
  );
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
  let dept = flow[currentDept];
  con.query(
    `INSERT INTO completed_takt_time (id, sales_order, part_number, qty, ${dept}) VALUES ('${id}', ${sales_order},'${part_number}', ${qty}, '${time}') ON DUPLICATE KEY UPDATE ${dept}='${time}', timestamp=CURRENT_TIMESTAMP`,
    (error, result) => {
      if (!error)
        console.log(
          `\x1b[35m Sucessfully logged takt time!: ${(id, time)}\x1b[0m`
        );
      io.sockets.emit("dept status change", {
        id: id,
        message: `Logged Takt Time ${id}.`,
      });
    }
  );
};

// Main Scan Function
app.post("/scan", (req, res) => {
  console.log(req.body);
  // sql save takt time with this data
  if (req.body.taktTime !== undefined) {
    logTaktTime(
      req.body.qrCode,
      req.body.sales_order,
      req.body.part_number,
      req.body.qty,
      req.body.taktTime,
      req.body.current_dept
    );
  }
  let update_dept = `UPDATE hopper SET current_dept=${req.body.nextDept}, timer_start=0, current_cell='hopper', takt_status='blue' WHERE id='${req.body.qrCode}'`;
  ///////////////////////////// deprecated with comma delimited flow
  // let send_to_laser = `UPDATE hopper SET current_dept=1, timer_start=0, current_cell='hopper', takt_status='blue' WHERE id='${req.body.qrCode}'`;
  let update_timer = `UPDATE hopper SET timer_start=1 WHERE id='${req.body.qrCode}'`;
  let order_exists = `SELECT * from hopper WHERE id='${req.body.qrCode}'`;

  con.query(order_exists, async (error, result) => {
    /// If order exists, try this
    try {
      let buildData = await result[0];
      //Skip nesting deptartment
      // if (buildData.current_dept !== 0) {
      //check timer, if 0, start it.
      if (buildData.timer_start === 0) {
        //start timer here.
        con.query(update_timer, (error, result) => {
          if (!error) {
            res
              .status(200)
              .send({ message: "Start Timer", build: buildData.id });
          } else {
            res.status(500).send("Error Starting Timer");
          }
        });
      } else {
        //change depts here
        con.query(update_dept, (error, result) => {
          if (!error) {
            if (result.changedRows === 0) {
              // TRIGGER ERROR because this build order doesnt exist
              res.status(500).send("Build Order Not Found");
            } else {
              console.log(
                "Successfully moved: ",
                req.body.qrCode,
                "Logged Takt: ",
                req.body.taktTime
              );
              res.status(200).send({
                message: "Stop Timer: ",
                build: buildData.id,
                loggedTime: req.body.taktTime,
              });

              // Let everyone know there's a dept!
              io.sockets.emit("dept status change", {
                id: req.body.qrCode,
                message: `Moving Order ${req.body.qrCode} to next dept.`,
              });
            }
          }
        });
      }
      ///////////////////////////// deprecated with comma delimited flow
      // } else {
      //   //send to next dept, cause we in nesting right now home boi.
      //   con.query(send_to_laser, (error, result) => {
      //     if (!error) {
      //       if (result.changedRows === 0) {
      //         // TRIGGER ERROR because this build order doesnt exist
      //         res.status(500).send("Build Order Not Found");
      //       } else {
      //         console.log("Successfully moved: ", req.body.qrCode);
      //         res.sendStatus(200);
      //         // Let everyone know there's a dept!
      //         io.sockets.emit("dept status change", {
      //           id: req.body.qrCode,
      //           message: `Moving Order ${req.body.qrCode} to next dept.`,
      //         });
      //       }
      //     }
      //   });
      // }
    } catch (error) {
      console.log("order_exists error", error);
      res.status(500).send("Build Order Not Found");
    }
  });
});

// Reset Timer if NO is selected from Laser
app.post("/timer_reset", (req, res) => {
  con.query(
    `UPDATE hopper SET timer_start=0 WHERE id='${req.body.id}'`,
    (error, result) => {
      res.send(result);
    }
  );
});

// Get logged takt time from completed_takt_time db
app.get("/completed_takt_time", (req, res) => {
  con.query(
    "SELECT * from completed_takt_time WHERE DATE(`timestamp`) = CURDATE()",
    (error, result) => {
      if (!error) {
        // console.log(result);
        res.send(result);
      }
    }
  );
});

// Get part info
app.get("/get_part_description", (req, res) => {
  console.log(req.body);
  let part_data_query = `SELECT item from takt_time WHERE part_number='${req.query.part}'`;
  con.query(part_data_query, (error, result) => {
    res.send(result[0]);
  });
});

app.post("/create_defect", (req, res) => {
  // Create Defect Log
  con.query(
    `INSERT INTO defect_log (id, sales_order, part_number, quantity, defect_dept, from_dept, from_cell, defect_category, defect_description) VALUES ('${req.body.id}', ${req.body.sales_order},'${req.body.part_number}', ${req.body.quantity}, '${req.body.defect_dept}','${req.body.from_dept}','${req.body.from_cell}','${req.body.defect_category}','${req.body.defect_description}')`,
    (error, result) => {
      if (!error) {
        res.sendStatus(200);
        io.sockets.emit("dept status change", {
          id: req.body.qrCode,
          message: `Defect Reported ${req.body.qrCode}`,
        });
      }
    }
  );
  // Reroute build to origin defect dept.
  con.query(
    `UPDATE hopper SET current_dept=${req.body.defect_dept}, timer_start=0, current_cell='hopper', takt_status='orange' WHERE id='${req.body.id}'`,
    (error, result) => {
      console.log(error);
      if (!error) {
        io.sockets.emit("dept status change", {
          id: req.body.id,
          message: `Defect Sent to Origin Defect Department ${req.body.id}`,
        });
      }
    }
  );
});

// Get Defect Log
app.get("/defect_log", (req, res) => {
  con.query(
    "SELECT * from defect_log WHERE DATE(`timestamp`) = CURDATE()",
    (error, result) => {
      if (!error) {
        // console.log(result);
        res.send(result);
      }
    }
  );
});

// Get flow with part number from flow sql table
app.get("/flow", (req, res) => {
  con.query(
    `SELECT * from flow WHERE part_number='${req.query.part}'`,
    async (error, result) => {
      res.send(result[0]);
    }
  );
});

// Get and parse Flow Card via filepath
app.get("/localflow", (req, res) => {
  let part = req.query.part;
  let desc = req.query.desc;
  let partsLibrary = part + " " + desc;
  partsLibrary = partsLibrary.replace(/\s+/g, "-");
  // let flowPdfPath = `\\\\ig\\Inventive\\Parts-Library\\${partsLibrary}\\${part}-Build-Order-Card-Parts-Flow.pdf`;
  // EXAMPLE PATH
  let flowPdfPath = `\\\\ig\\Inventive\\Parts-Library\\ITD1570-70-Inch-Under-Body-Tool-Box\\ITD1570-Build-Order-Card-Parts-Flow.pdf`;
  pdf2html.text(flowPdfPath, (err, flowData) => {
    if (err) {
      console.log("Conversion error: ", err);
    } else {
      let flowSplitDate = flowData.split("DATE:")[1];
      flowSplitDate = flowSplitDate.replace(/\n/g, ",");
      let flowArray = flowSplitDate.split(",");
      flowArray.splice(0, 3);
      flowArray.splice(8, 11);
      let flow = {};
      flowArray.map((flowDept, i) => {
        let dept = flowDept.split(":");
        let deptName = dept[0].replace(/\t/g, "");
        flow[deptName] = dept[1].replace(" ", "");
      });
      console.log("\x1b[35m");
      console.log(flow);
      console.log("\x1b[0m");
      res.json(flow);
    }
  });
});

// Test PDF opening.
app.get("/testlcl", (req, res) => {
  let pdfFilePath = `\\\\ig\\Inventive\\Parts-Library\\ITD1570-70-Inch-Under-Body-Tool-Box\\ITD1570-Build-Order-Card-Parts-Flow.pdf`;

  //Return JSONified cut list.
  pdfPar.pdf2json(pdfFilePath, (error, pdf) => {
    if (error) {
      console.log(error);
    } else {
      console.log("\x1b[35m READING PDF...\x1b[0m");
      res.json(pdf);
    }
  });
});
// Open local procedures
app.get("/localfolder", (req, res) => {
  let part = req.query.part;
  let desc = req.query.desc;
  // let dept = req.query.dept;
  let partsLibrary = part + " " + desc;
  partsLibrary = partsLibrary.replace(/\s+/g, "-");

  ///////////////// The legend of opening PDFS, need folder renames for this... lol
  // if (dept === "SHOP - Laser Cut List") {
  //   dept = dept + "\\" + part + " Laser Cut List.pdf";
  //   let pdfFilePath = `\\\\ig\\Inventive\\Parts-Library\\${partsLibrary}\\`;
  //   // let pdfFilePath = `\\\\ig\\Inventive\\Parts-Library\\ITD4518-SP9-No-Controls\\SHOP - Laser Cut List\\ITD4518-Laser-Cut-List.pdf`;
  //   //Return JSONified cut list.
  //   pdfPar.pdf2json(pdfFilePath, (error, pdf) => {
  //     if (error) {
  //       res
  //         .status(500)
  //         .send("Error Opening Procedure. Please Find It Manually.");
  //     } else {
  //       res.json({ pdfData: pdf });
  //     }
  //   });
  //   // Open cut list PDF.
  //   try {
  //     localfs.exec(
  //       `start "" "\\\\ig\\Inventive\\Parts-Library\\${partsLibrary}"`
  //     );
  //     console.log("Attempting to Open: " + partsLibrary);
  //   } catch (e) {
  //     res.status(500).send("Error Opening Parts Library Folder");
  //   }
  // } else {
  // Open procedure PDF.
  if (req.query.part == "ITD0000") {
    localfs.exec(`start "" "\\\\ig\\Inventive\\Parts-Library"`);
  }
  try {
    localfs.exec(
      `start "" "\\\\ig\\Inventive\\Parts-Library\\${partsLibrary}"`
    );
    console.log("Opening local procedures: " + partsLibrary);
    res.send("Opening Folder!");
  } catch (e) {
    localfs.exec(`start "" "\\\\ig\\Inventive\\Parts-Library"`);
    res.status(500).send({ message: "Error Opening Parts Library Folder" });
  }
  // }
});

// Get entire build order from hopper
app.post("/buildorder", (req, res) => {
  con.query(
    `SELECT * from hopper WHERE id='${req.body.id}'`,
    async (error, result) => {
      res.send(result);
    }
  );
});

// Get entire hopper
app.get("/hopper", (req, res) => {
  // order by xxxx desc
  con.query(
    `SELECT * from hopper ORDER BY release_date`,
    async (error, result) => {
      res.send(result);
    }
  );
});

// Update current cell.
app.get("/cell", (req, res) => {
  con.query(
    `UPDATE hopper SET current_cell='${req.query.current_cell}' WHERE id='${req.query.id}'`,
    async (error, result) => {
      //   console.log(result);
      res.send(result);
    }
  );
});

// Update/Set Operator in Cell
app.post("/save_operator", (req, res) => {
  con.query(
    `INSERT INTO operators (cell, operator) VALUES ('${req.body.cell}', '${req.body.operator}') ON DUPLICATE KEY UPDATE operator='${req.body.operator}'`,
    (error, result) => {
      if (!error) {
        console.log(
          `Updated Operator at ${req.body.cell} to ${req.body.operator} `
        );
      }
    }
  );
});

// Select all operators
app.get("/get_operator", (req, res) => {
  con.query("SELECT * from operators", (error, result) => {
    res.send(result);
  });
});

// Get operators in a certain dept.
app.get("/get_operator_dept", (req, res) => {
  con.query(`SELECT * from operators WHERE dept=${req.query.dept}`);
});

// Update takt status/digital andon color
app.post("/taktstatus", (req, res) => {
  con.query(
    `UPDATE hopper SET takt_status='${req.body.takt_status}' WHERE id='${req.body.id}'`,
    async (error, result) => {
      if (!error) {
        io.sockets.emit("dept status change", {
          id: req.body.id,
          dept: "",
          message: `Takt Status updated for ${req.body.id} to ${req.body.takt_status}`,
        });
      }
    }
  );
});

server.listen(port, () => console.log(`Server Ready on Port: ${port}`));

// Fill SQL DB With Gsheet rows
const syncGsheet = async () => {
  // Function data-logging.
  let date = new Date();
  let now = date.toLocaleTimeString();
  let nextSync =
    date.getHours() +
    1 +
    ":" +
    ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes());
  console.log("\x1b[34m GSheetSync Started @ " + now);
  console.log("\x1b[0m");
  // Set correct gSheet.
  const doc = new GoogleSpreadsheet(
    "1-WMquhi1LqPfJW1_TwBjAfWAb0aB_PcXr__rzboQ0ko"
  );
  // Try pulling data from gSheets.
  try {
    await doc.useServiceAccountAuth({
      client_email: "genbutsu@itd-scheduler-genbutsu.iam.gserviceaccount.com",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDtaA4GlJvmgreo\nqHcGBIpSY0I3MFIku6pHHNBwKUeDwAbz98fL6N6bZSSW6mhrs6FYp1DlVsozGYZ7\n7XDW9oWNaGmsj83O7D1DoS+t2TBmS37anl5TiFFdPdmS3QcJNDX+YUKp+v+/Les9\nfYG2xsngUXTjtnCKjm2GKJB6RWghnZ1MqJmiOHRnjGm7uFNuMJ0Ys5RNP0A/sXxB\nYU8WCS1Igsadcx6FMbVpT6Ri/xH99iWjh7hRk4r0LtRNCzVk1w7VJ/xoyVy61XET\nGLkbmsbYpFpRE51eNmj6/3CA+EzHN159orwH6VMHFHTiSWzkUwOFIQ6TRuo09umA\nbRKIhvFhAgMBAAECggEAcPH/MjxDS1BHJhM3xQIl+HpGh1ES020A3qIjvCi3YEPc\nSvdH84fPWCivVqkgkpS8HxxCzUkUG2l6ZL0a4PoZoaPaGoGzzUzw/JrTvybD8vbZ\n3BJaF+2ToAOL3mYPMd7IDUSiXZIPWBn1f6SVMKq0Ymb+cFNciV6nVps32SPqHYsf\nNfqR7DZV4r3hH2BR91m4Y/d1L4DUtkzXhFKivgWNsR8B2bfaj9C4agAjHVfvgpsq\nh4lsDMSXJE5LW9opHmmmTbc4LSu9TQ1vHs9H6HoQ2bU8l+a1uBeiBijmiWpaxLtP\nUaydPlyNoqgQpt3UjD1lt6wTRfeQqiAFBwdMj6LKXQKBgQD4CGmKH14rWizZZQRc\nf1zTgmewjo4KON4KmUQX+3R2ZoEHDk+YqVsvW0/BxJ/ycidiD+TTwb81QHbX/IXk\nIDvj/ON3j3ixy6meLT+c4x0Opwb36zjwUKrQOOYWdM228z9y34ix3rl4Qis6qFh+\nhsScJDhHeinVzMAbAgzYuBhgywKBgQD1CELWmtmtTb8rd/w/lV/yCQy/mhbIhSRv\ndHOQ8H2cqSJUEUeyXPsmRX/By/Tra6H9ew3S1V5QyOHWi1iJanvYlmOnlcAVGYg5\noKdSuZh7yjWGe4k6uri2mwqkB/i6iYFf4W38cOq4i6LPcoRM/h/QmxEqmC7ZwLHX\njs1/IQqNAwKBgH/xZu+Wyq62L1hcoWlNUYbRR8dtYZuoRfFVqihsz2Cb84a+PRTU\nl3LQOU4MrS0U8XfGFxWcZZOEk0lKu443im1Kb9OmsG2WTwKG+L9m8AA07IVKUu6z\nzcjm8Nk4mzz6MQqCgDKwXx/HkiEJ4cwynIymqllEjPv6SEYmQpYwMHMNAoGBAPAU\nDAjg5+6ZgnlAsnJKFRu8KjWA8Fm/uhdJ7gFQ4IIiZXQhCjKET78L0UU8ZNhVOP53\nFvBABoz4he4D0dex8W4gy7tjSjRiM8ri0Y6IMhL36MG/QJG+aUThW+ejt9xs5cnf\nwjfZGuF+TyMafO5C/0EQ7hzhxuWrm5QsYsPwx7mpAoGADaEahAECtypfwBLsuInM\nS1ZdFJOUDi8yfm3FGamKlCjVPns6QQOMpdmQ+tnFCFXz0ygR1lr6b2sd30ioN8g2\nZQiweFYg10opBIHNTYhKnfzTQWZYIFAvGCEBDSORLZN1SpDn3XW9lYSmQjyQ1tVj\n7D1ZETPicne1lXvlfIylDyQ=\n-----END PRIVATE KEY-----\n",
    });
    //Get doc/sheet data
    await doc.loadInfo();
    const sheet = await doc.sheetsById[1097625412];
    const rows = await sheet.getRows();
    await sheet.loadCells();
    for (let i = 0; i < rows.length; i++) {
      let parsedRowData = JSON.stringify(rows[i]._rawData).replace("'", "ft");
      let updateSQL = `UPDATE takt_time SET item='${parsedRowData}' WHERE part_number='${rows[i]._rawData[0]}'`;
      con.query(updateSQL, (error, result) => {
        if (error !== null) {
          console.log(error);
        }
      });
    }
    console.log(
      `\x1b[42m GSheetSync Complete 👍 - Next Sync @ ${nextSync} \x1b[0m`
    );
  } catch (e) {
    console.log(e);
  }
  // Set timeout for how often data is refreshed.
  setTimeout(syncGsheet, 60 * 60 * 1000);
};
syncGsheet();

/*
TREE OF DEPRECATION:
    *
   **
  ****
 ******
   ||

 Deprecated: Reading from local CSV, worked well but updating it regularlly with fresh takt times was not automated enough - Nate 5/5/21




*/

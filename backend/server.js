const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to receive text and return Excel
app.post("/api/import", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  // Defining keys and order
  const rowOrder = ["VL 100","VL 200","VL 300","VL 400","VL 500","VL 600","Bulk Area","Unload","QA"];
  const rows = [];
  let stationTotal = 0;

  // Map to store number count and trackID+cause per Vanline
  const dataMap = {};
  rowOrder.forEach(r => dataMap[r] = { number: 0, trackRows: [] });

  const lines = text.split("\n").filter(l => l.trim() !== "");
  lines.forEach(line => {
    const [rowPart, rest] = line.split(":");
    if (!rest) return;
    const rowType = rowPart.trim();
    if (!rowOrder.includes(rowType)) return;

    const value = rest.trim();

    // If it's a number
    if (!isNaN(value)) {
      dataMap[rowType].number += parseInt(value);
      stationTotal += parseInt(value);
    } else {
      // trackID | cause
      const [trackID, cause] = value.split("|").map(s => s.trim());
      if (trackID) {
        dataMap[rowType].trackRows.push({ trackID, cause: cause || "" });
      }
    }
  });

  // Build rows in order
  rowOrder.forEach(r => {
    const info = dataMap[r];

    // Add number row if present
    if (info.number > 0) {
      rows.push({
        Vanline: r,
        "VL code 37 totals & trackID's": info.number,
        Cause: ""
      });
    }

    // Add trackID rows
    info.trackRows.forEach(tr => {
      rows.push({
        Vanline: "",
        "VL code 37 totals & trackID's": tr.trackID,
        Cause: tr.cause
      });
    });

    // Ensure row exists if empty
    if (info.number === 0 && info.trackRows.length === 0) {
      rows.push({
        Vanline: r,
        "VL code 37 totals & trackID's": "",
        Cause: ""
      });
    }
  });

  // Add Station total
  rows.push({
    Vanline: "Station total",
    "VL code 37 totals & trackID's": stationTotal,
    Cause: ""
  });

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Calculate max length for each column
  const colWidths = rows[0] 
    ? Object.keys(rows[0]).map(key => {
        return {
          wch: Math.max(
            key.length,
            ...rows.map(row => (row[key] ? row[key].toString().length : 0))
          )
        };
      })
    : [];

  // Apply column widths
  worksheet['!cols'] = colWidths;

  // Align numbers to left
  Object.keys(worksheet).forEach(cell => {
  if (worksheet[cell].t === 'n') { // numeric cell type
    // Formatting the number as a text item so it can left align.
    worksheet[cell].z = '@'; 
    worksheet[cell].s = { alignment: { horizontal: "left" } };
  }
});

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Convert workbook to buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  // Send file
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Vanline37_Import.xlsx"
  );
  res.type(
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
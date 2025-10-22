Vanline 37 Importer

Summary

Vanline 37 Importer is a lightweight tool for processing Vanline 37 data. Users can input data with counts, track IDs, 
and reasons, and the app automatically generates an organized Excel spreadsheet with totals and track details. 
Ideal for warehouse, logistics, or operations teams needing a quick way to format and track shipments.

Features

- Parse input text to extract counts, track IDs, and reasons.

- Automatically calculates totals per station and per Vanline type.

- Generates a clean Excel (.xlsx) file ready for reporting.

- Supports multiple rows per Vanline type for multiple track IDs.

- Column widths automatically adjust based on content for readability.

- Works locally or deployed via web backend and frontend.

Usage
1. Input Format

Enter your data in the following format in the text area:

VL 100: 2
VL 100: 888888888888 | Damaged packaging
VL 200: 5
VL 200: 777777777777 | Late arrival
Bulk Area: 1
Unload: 2
QA: 888888888888 | Missing labels


Format explanation:

VL 100: 2 → Number of 37s for VL 100.

VL 100: 888888888888 | Damaged packaging → Track ID and reason.

Each Vanline type (VL 100, VL 200, etc.) must be followed by : and a number or track + reason.

Multiple entries per Vanline are supported; each gets its own row in Excel.

2. Generate Excel File

Input your text as shown above.

Click Generate Excel.

The app creates an .xlsx file containing:

Vanline counts.

Track IDs and their reasons.

Station total.

3. Deployment
Backend (Render Web Service)

Hosted as a Node.js web service.

Start command: node server.js

Frontend (Render Static Site)

Build command: npm run build.

Publish directory: frontend/build.

4. Installation (Local)

# Clone repo
git clone https://github.com/<your-username>/Vanline-37-Importer.git

# Backend setup
cd backend
npm install
node server.js

# Frontend setup
cd ../frontend
npm install
npm start

5. Notes

Track IDs are recognized as 12-digit numbers.

Numbers are automatically totaled; track IDs do not increment totals.

Excel columns auto-adjust to content length.

Numbers are left-aligned for readability; track IDs and reasons start at the beginning of the cell.


Link for use here https://vanline-37-importer-1.onrender.com

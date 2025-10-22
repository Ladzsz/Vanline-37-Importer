import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "./Styles/Body.css";

export default function ImporterBody({ onSubmit }) {
  //states  
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  
  //on submit import file
  const handleSubmit = async (e) => {
    e.preventDefault();

    //trimming text
    if (text.trim() === "") return alert("Please enter some text first!");

    //beginniing loading
    setLoading(true);

    //grabbing date
    const date = new Date().toISOString().split("T")[0];

    //fill this in with link to backend 
    try {
      // Make POST request to backend
       const response = await axios.post(
        "http://localhost:5000/api/import",
        { text },
        { responseType: "blob" } // Important: we expect a file back
    );

      // Save Excel file
      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Vanline37_Import_${date}.xlsx`);
      alert("✅ Excel file generated successfully!");
    } catch (error) {
      console.error("Import failed:", error);
      alert("❌ Failed to generate file. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="importer-body">
      <div className="importer-card">
        <h2 className="importer-title">Import Your Data</h2>

        <form onSubmit={handleSubmit} className="importer-form">
          <textarea
            className="importer-textarea"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <button type="submit" className="importer-button" disabled={loading}>
            {loading ? "Snitching..." : "Import"}
          </button>
        </form>
      </div>
    </main>
  );
}

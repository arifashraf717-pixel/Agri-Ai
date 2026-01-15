// src/components/FarmManagementApp.jsx
import React, { useState, useEffect, useMemo } from "react"; // Added useMemo for efficiency
import { useNavigate } from "react-router-dom";
import { CheckCircle, Trash2, TrendingUp, TrendingDown } from "lucide-react"; // Added icons for profit/loss 
import "./FarmManagementApp.css";

function FarmManagementApp() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("tasks");

  // ---------------- Farmer Tasks ----------------
  const [tasks, setTasks] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]); 

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    notes: "",
    priority: "Medium",
    category: "General",
  });

  // ---------------- Cattle Tracker ----------------
  const [activeTab, setActiveTab] = useState("vaccination");
  const [records, setRecords] = useState({
    vaccination: [],
    deworming: [],
    milk: [],
    breeding: [],
    health: [],
  });
  const [form, setForm] = useState({});
// NEW STATE for Milk Tracker (Simulating Price/Cost input)
  const [milkSettings, setMilkSettings] = useState(() => {
    const savedSettings = localStorage.getItem("milkSettings");
    return savedSettings ? JSON.parse(savedSettings) : { pricePerLiter: 40, costPerLiter: 30 };
  });


  // ---------------- Load from localStorage ----------------
  useEffect(() => {
    const savedTasks = localStorage.getItem("farmerTasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks).filter((t) => !t.done));

    const savedRecords = localStorage.getItem("cattleRecords");
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    
    const savedVaccinations = localStorage.getItem("vaccinationRecords");
    if (savedVaccinations) setVaccinationRecords(JSON.parse(savedVaccinations).filter((v) => !v.done));
  }, []);

  // ---------------- Save to localStorage ----------------
  useEffect(() => {
    const savedTasks = localStorage.getItem("farmerTasks");
    const mergedTasks = [
      ...JSON.parse(savedTasks || "[]").filter((t) => t.done),
      ...tasks,
    ];
    localStorage.setItem("farmerTasks", JSON.stringify(mergedTasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("cattleRecords", JSON.stringify(records));
  }, [records]);
    
  useEffect(() => {
    const allVac = JSON.parse(localStorage.getItem("vaccinationRecords") || "[]");
    const mergedVac = [...allVac.filter((v) => v.done), ...vaccinationRecords];
    localStorage.setItem("vaccinationRecords", JSON.stringify(mergedVac));
  }, [vaccinationRecords]);

// NEW: Save Milk Settings
  useEffect(() => {
    localStorage.setItem("milkSettings", JSON.stringify(milkSettings));
  }, [milkSettings]);

  // ---------------- Farmer Task Handlers (Existing) ----------------
  const handleTaskChange = (e) =>
    setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate)
      return alert("Title and due date required!");
    const task = { ...newTask, id: Date.now(), done: false };
    setTasks([...tasks, task]);
    setNewTask({ title: "", dueDate: "", notes: "", priority: "Medium", category: "General" });
    // Removed automatic navigation for better UX flow in the app context
  };

  const toggleDone = (id) => {
    const saved = localStorage.getItem("farmerTasks");
    const allTasks = saved ? JSON.parse(saved) : [];
    const updated = allTasks.map((t) => (t.id === id ? { ...t, done: true } : t));
    localStorage.setItem("farmerTasks", JSON.stringify(updated));
    setTasks(updated.filter((t) => !t.done));
  };

  const deleteTask = (id) => {
    if (!window.confirm("Delete this task?")) return;
    const saved = localStorage.getItem("farmerTasks");
    const allTasks = saved ? JSON.parse(saved) : [];
    const updated = allTasks.filter((t) => t.id !== id);
    localStorage.setItem("farmerTasks", JSON.stringify(updated));
    setTasks(updated.filter((t) => !t.done));
  };

  const getCardStyle = (dueDate) => {
    const now = new Date();
    const d = new Date(dueDate);
    if (d < now) return "bg-danger text-white";
    if ((d - now) / (1000 * 60 * 60 * 24) <= 2) return "bg-warning";
    return "bg-light";
  };

  // ---------------- Cattle Tracker Handlers (UPGRADED) ----------------
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(form).length === 0) return alert("Please fill details");
    
    const newRecord = { ...form, id: Date.now(), done: false }; 

    if (activeTab === "vaccination" || activeTab === "deworming") {
        const dashboardRecord = {
            id: newRecord.id,
            animal: newRecord.animal,
            vaccine: newRecord.vaccine || newRecord.medicine, 
            date: newRecord.date,
            nextDate: newRecord.nextDate || "Not Set",
            done: false 
        };
        setVaccinationRecords(prev => [...prev, dashboardRecord]);
    }

    setRecords({
      ...records,
      [activeTab]: [...records[activeTab], newRecord],
    });
    setForm({});
    // Removed automatic navigation for better UX flow
  };
    
  const markRecordDone = (tab, id) => {
    // 1. Update main cattle records
    const updatedRecords = records[tab].map(r => 
        r.id === id ? { ...r, done: true } : r
    );
    setRecords({
        ...records,
        [tab]: updatedRecords,
    });
    
    // 2. Update dashboard sync records if applicable
    if (tab === "vaccination" || tab === "deworming") {
        const saved = localStorage.getItem("vaccinationRecords");
        const allVac = saved ? JSON.parse(saved) : [];
        
        const updatedVac = allVac.map((v) => 
            v.id === id ? { ...v, done: true } : v
        );
        localStorage.setItem("vaccinationRecords", JSON.stringify(updatedVac));
        
        setVaccinationRecords(prev => prev.filter(v => v.id !== id));
    }
  };
    
  const deleteRecord = (tab, id) => {
    if (!window.confirm(`Delete this ${tab} record permanently?`)) return;

    // 1. Update main cattle records
    setRecords({
        ...records,
        [tab]: records[tab].filter((r) => r.id !== id),
    });

    // 2. Update dashboard sync records if applicable
    if (tab === "vaccination" || tab === "deworming") {
        const saved = localStorage.getItem("vaccinationRecords");
        const allVac = saved ? JSON.parse(saved) : [];
        const updated = allVac.filter((v) => v.id !== id);
        localStorage.setItem("vaccinationRecords", JSON.stringify(updated));
        setVaccinationRecords(prev => prev.filter(v => v.id !== id));
    }
  };


  const renderForm = () => {
    switch (activeTab) {
      case "vaccination":
        return (
          <>
            <input type="text" name="animal" placeholder="Animal Name/ID" value={form.animal || ""} onChange={handleChange} required />
            <input type="text" name="vaccine" placeholder="Vaccine Name" value={form.vaccine || ""} onChange={handleChange} required />
            <label>Date Administered:</label>
            <input type="date" name="date" value={form.date || ""} onChange={handleChange} required />
            <label>Next Due Date (Optional):</label>
            <input type="date" name="nextDate" value={form.nextDate || ""} onChange={handleChange} />
          </>
        );
      case "deworming":
        return (
          <>
            <input type="text" name="animal" placeholder="Animal Name/ID" value={form.animal || ""} onChange={handleChange} required />
            <input type="text" name="medicine" placeholder="Deworming Medicine" value={form.medicine || ""} onChange={handleChange} required />
            <label>Date Administered:</label>
            <input type="date" name="date" value={form.date || ""} onChange={handleChange} required />
            <label>Next Due Date (Optional):</label>
            <input type="date" name="nextDate" value={form.nextDate || ""} onChange={handleChange} />
          </>
        );
      case "milk":
        return (
          <>
            <input type="text" name="animal" placeholder="Animal Name" value={form.animal || ""} onChange={handleChange} required />
            <input type="number" name="milkYield" placeholder="Milk Yield (liters)" value={form.milkYield || ""} onChange={handleChange} required />
            <label>Date:</label>
            <input type="date" name="date" value={form.date || ""} onChange={handleChange} required />
          </>
        );
      case "breeding":
        return (
          <>
            <input type="text" name="animal" placeholder="Animal Name" value={form.animal || ""} onChange={handleChange} required />
            <label>Insemination Date:</label>
            <input type="date" name="inseminationDate" value={form.inseminationDate || ""} onChange={handleChange} required />
            <label>Expected Calving Date:</label>
            <input type="date" name="expectedCalving" value={form.expectedCalving || ""} onChange={handleChange} />
            <label>Actual Calving Date:</label>
            <input type="date" name="actualCalving" value={form.actualCalving || ""} onChange={handleChange} />
          </>
        );
      case "health":
        return (
          <>
            <input type="text" name="animal" placeholder="Animal Name" value={form.animal || ""} onChange={handleChange} required />
            <input type="text" name="issue" placeholder="Health Issue / Checkup" value={form.issue || ""} onChange={handleChange} />
            <input type="text" name="treatment" placeholder="Treatment / Medicine" value={form.treatment || ""} onChange={handleChange} />
            <label>Date:</label>
            <input type="date" name="date" value={form.date || ""} onChange={handleChange} />
          </>
        );
      default:
        return <p>Other trackers can be added similarly.</p>;
    }
  };
    
  const getTableHeaders = (recordsArray) => {
    if (recordsArray.length === 0) return [];
    
    let headers = Object.keys(recordsArray[0]).filter(k => k !== "id" && k !== "done");

    // Milk tracker doesn't need Status, just a cleaner view
    if (activeTab === "milk") {
        headers = headers.filter(h => h !== 'milkYield'); // Will display as a column in the body
        return ["ANIMAL", "DATE", "YIELD (L)", "ACTIONS"];
    }
    
    if (activeTab === "vaccination" || activeTab === "deworming") {
        headers = [...headers, "Status", "Actions"];
    } else {
        headers = [...headers, "Actions"];
    }
    return headers.map(h => h.toUpperCase().replace('DATE', 'DATE').replace('YIELD', 'YIELD (L)'));
  }


// ---------------- NEW Milk Summary Logic ----------------
  const milkSummary = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlySummary = {};

    records.milk.forEach(r => {
        const recordDate = new Date(r.date);
        const monthYearKey = `${recordDate.getFullYear()}-${recordDate.getMonth()}`;
        const animalKey = r.animal || "Unknown";
        const yieldValue = parseFloat(r.milkYield);

        if (isNaN(yieldValue)) return;

        if (!monthlySummary[monthYearKey]) {
            monthlySummary[monthYearKey] = { totalYield: 0, animalYields: {} };
        }

        monthlySummary[monthYearKey].totalYield += yieldValue;
        monthlySummary[monthYearKey].animalYields[animalKey] = 
            (monthlySummary[monthYearKey].animalYields[animalKey] || 0) + yieldValue;
    });

    const currentMonthKey = `${currentYear}-${currentMonth}`;
    const currentMonthData = monthlySummary[currentMonthKey] || { totalYield: 0, animalYields: {} };

    return {
        all: monthlySummary,
        current: currentMonthData
    };
  }, [records.milk]);

  const renderMilkSummary = () => {
    const { totalYield, animalYields } = milkSummary.current;
    const { pricePerLiter, costPerLiter } = milkSettings;
    const profitPerLiter = pricePerLiter - costPerLiter;
    const monthlyProfit = totalYield * profitPerLiter;

    return (
        <div className="summary-card p-3 mb-4">
            <h5 className="text-center mb-3">💰 Monthly Milk Production Summary ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</h5>
            <div className="d-flex justify-content-around text-center gap-3">
                <div className="flex-fill p-2 bg-info text-white rounded">
                    <strong>Total Yield:</strong><br />
                    <h3>{totalYield.toFixed(2)} L</h3>
                </div>
                <div className="flex-fill p-2 bg-secondary text-white rounded">
                    <strong>Net Profit Margin/L:</strong><br />
                    <h3>{profitPerLiter.toFixed(2)}</h3>
                </div>
                <div className={`flex-fill p-2 rounded ${monthlyProfit >= 0 ? 'bg-success' : 'bg-danger'} text-white`}>
                    <strong>Monthly Profit/Loss:</strong><br />
                    <h3>{monthlyProfit.toFixed(2)}</h3>
                </div>
            </div>

            <h6 className="mt-3">Individual Animal Yields:</h6>
            <ul className="list-unstyled d-flex flex-wrap gap-3">
                {Object.entries(animalYields).map(([animal, yieldValue]) => (
                    <li key={animal} className="p-1 bg-light border rounded">
                        <strong>{animal}:</strong> {yieldValue.toFixed(2)} L
                    </li>
                ))}
            </ul>

            <div className="settings-controls mt-3">
                <h6 className="mb-2">Setup Price/Cost:</h6>
                <div className="d-flex gap-2">
                    <input 
                        type="number" 
                        placeholder="Price/L" 
                        value={milkSettings.pricePerLiter} 
                        onChange={(e) => setMilkSettings({...milkSettings, pricePerLiter: parseFloat(e.target.value) || 0})}
                        min="0"
                    />
                    <input 
                        type="number" 
                        placeholder="Cost/L" 
                        value={milkSettings.costPerLiter} 
                        onChange={(e) => setMilkSettings({...milkSettings, costPerLiter: parseFloat(e.target.value) || 0})}
                        min="0"
                    />
                </div>
            </div>
        </div>
    );
  };
// ---------------- END Milk Summary Logic ----------------


  return (
    <div className="tracker-container">
      <h1>🌾 Farm Management</h1>

      {/* ---------------- Page Switch (Unchanged) ---------------- */}
      <div className="text-center mb-4">
        <button
          className={`btn ${activePage === "tasks" ? "btn-primary" : "btn-light"} me-2`}
          onClick={() => setActivePage("tasks")}
        >
          Farmer Tasks
        </button>
        <button
          className={`btn ${activePage === "cattle" ? "btn-success" : "btn-light"}`}
          onClick={() => setActivePage("cattle")}
        >
          Cattle Tracker
        </button>
      </div>

      {/* ---------------- Tasks Section (Unchanged) ---------------- */}
      {activePage === "tasks" && (
        <div>
          <div className="form-card">
            <h4>Add New Task</h4>
            <form onSubmit={addTask}>
              <input type="text" name="title" placeholder="Task Title" value={newTask.title} onChange={handleTaskChange} required />
              <input type="datetime-local" name="dueDate" value={newTask.dueDate} onChange={handleTaskChange} required />
              <textarea name="notes" placeholder="Notes" value={newTask.notes} onChange={handleTaskChange} />
              <div className="d-flex gap-2 mb-2">
                <select name="priority" value={newTask.priority} onChange={handleTaskChange}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select name="category" value={newTask.category} onChange={handleTaskChange}>
                  <option value="General">General</option>
                  <option value="Crop">Crop</option>
                  <option value="Livestock">Livestock</option>
                </select>
              </div>
              <button type="submit" className="btn-save">➕ Add Task</button>
            </form>
          </div>

          <div className="records-section">
            <h4>Pending Tasks</h4>
            {tasks.length === 0 ? <p className="text-muted">No pending tasks. Great job! 🎉</p> : (
                tasks.map((task) => (
                    <div key={task.id} className={`card p-3 mb-2 ${getCardStyle(task.dueDate)}`}>
                        <h5>{task.title}</h5>
                        <p><strong>Category:</strong> {task.category}</p>
                        <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}</p>
                        {task.notes && <p><em>{task.notes}</em></p>}
                        <div className="d-flex gap-2">
                            <button className="btn btn-success btn-sm" onClick={() => toggleDone(task.id)}>✅ Done</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>❌ Delete</button>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- Cattle Tracker Section (UPGRADED) ---------------- */}
      {activePage === "cattle" && (
        <div>
          <div className="tracker-tabs">
            {["vaccination", "deworming", "milk", "breeding", "health"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => { setActiveTab(tab); setForm({}); }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-card">
            <h4>➕ Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Record</h4>
            {renderForm()}
            <button type="submit" className="btn-save mt-2">Save Record</button>
          </form>
            
          {/* RENDER MILK SUMMARY HERE */}
          {activeTab === "milk" && renderMilkSummary()}

          <div className="records-section">
            <h4>📋 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Records</h4>
            {records[activeTab].length === 0 ? (
              <p>No records yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    {getTableHeaders(records[activeTab]).map((key) => (
                          <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {records[activeTab].map((r) => (
                    <tr key={r.id} className={r.done ? "done-row" : ""}>
                          {activeTab === "milk" ? (
                              <>
                                  <td>{r.animal || "-"}</td>
                                  <td>{r.date || "-"}</td>
                                  <td>{r.milkYield || "-"} L</td>
                              </>
                          ) : (
                            Object.keys(r).filter(k => k !== "id" && k !== "done").map((key) => (
                                <td key={key}>{r[key] || "-"}</td>
                            ))
                          )}
                          
                          {/* Render Status and Action for Vaccination/Deworming */}
                          {(activeTab === "vaccination" || activeTab === "deworming") && (
                              <>
                                  <td className="text-center">
                                      {r.done ? (
                                          <span className="status-done">✅ Completed</span>
                                      ) : (
                                          <button
                                              onClick={() => markRecordDone(activeTab, r.id)}
                                              className="btn btn-success btn-sm"
                                          >
                                              <CheckCircle size={14} /> Done
                                          </button>
                                      )}
                                  </td>
                                  <td>
                                      <button 
                                          onClick={() => deleteRecord(activeTab, r.id)} 
                                          className="btn btn-danger btn-sm"
                                      >
                                          <Trash2 size={14} /> Delete
                                      </button>
                                  </td>
                              </>
                          )}
                          
                          {/* Render only Action for Milk, Breeding, Health */}
                          {!(activeTab === "vaccination" || activeTab === "deworming") && (
                            <td>
                                <button 
                                    onClick={() => deleteRecord(activeTab, r.id)} 
                                    className="btn btn-danger btn-sm"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </td>
                          )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>⬅ Back to Dashboard</button>
      </div>
    </div>
  );
}

export default FarmManagementApp;
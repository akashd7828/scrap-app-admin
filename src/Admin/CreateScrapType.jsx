import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Create.css";

const CreateScrapType = () => {
  const [scrapType, setScrapType] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("kg");
  const [minWeight, setMinWeight] = useState("");
  const [note, setNote] = useState("");
  const [scraps, setScraps] = useState([]);
  const [formVisible, setFormVisible] = useState(true);

  const fetchScrapTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/scrap-types`
      );
      setScraps(response.data); // Assuming response.data is an array of scrap types
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching scrap types."
      );
    }
  };

  useEffect(() => {
    fetchScrapTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/scrap-types`,
        {
          scrapType,
          amount,
          unit,
          minWeight,
          note,
        }
      );
      // Add new scrap to the list
      setScraps((prevScraps) => [
        ...prevScraps,
        { scrapType, amount, unit, minWeight, note, id: response.data._id },
      ]);
      // Reset form and hide it
      setScrapType("");
      setAmount("");
      setUnit("");
      setMinWeight("");
      setNote("");
      setFormVisible(false);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="container">
      {formVisible ? (
        <>
          <h2>Create Scrap Type</h2>
          <form onSubmit={handleSubmit} className="scrap-form">
            <div className="form-row">
              <div className="input-data">
                <input
                  value={scrapType}
                  onChange={(e) => setScrapType(e.target.value)}
                  placeholder="Scrap Type*"
                  required
                />
                <label>Scrap Type*</label>
              </div>
              <div className="input-data">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount*"
                  required
                />
                <label>Rate*</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="kg">per kg</option>
                  <option value="unit">per unit</option>
                </select>
                <label>Unit*</label>
              </div>

              <div className="input-data">
                <input
                  type="number"
                  value={minWeight}
                  onChange={(e) => setMinWeight(e.target.value)}
                  placeholder="Min Weight*"
                  required
                />
                <label>Min Weight*</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-data">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note (Optional)"
                  rows="3"
                />
                <label>Note</label>
              </div>
            </div>
            <div className="form-row submit-btn">
              <button type="submit">Create Scrap</button>
            </div>
          </form>
        </>
      ) : (
        <button onClick={() => setFormVisible(true)} className="add-btn">
          Add Scrap Type
        </button>
      )}

      {scraps.length > 0 && (
        <div className="scrap-list">
          <h2>Scrap Types</h2>
          <ul>
            {scraps.map((scrap) => (
              <li key={scrap.id}>
                <strong>{scrap.scrapType}</strong>: {scrap.amount} ({scrap.unit}
                )
                <br />
                <em>Min Weight:</em> {scrap.minWeight} <br />
                <em>Note:</em> {scrap.note ? scrap.note : "No notes"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateScrapType;

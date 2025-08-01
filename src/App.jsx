import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import FoodForm from './components/FoodForm';
import AboutPage from './components/AboutPage';
import axios from 'axios';

function App() {
  const [foodPins, setFoodPins] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const API_URL = "http://localhost:5000/pins";

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get(API_URL);
        setFoodPins(res.data);
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    };
    fetchPins();
  }, []);

  const handleAddFood = async (newPin) => {
    try {
      const res = await axios.post(API_URL, newPin);
      setFoodPins([...foodPins, res.data]);
      setSelectedLocation(null);
    } catch (err) {
      console.error("Error adding pin:", err);
    }
  };

  const getValidPins = () => {
    const now = Date.now();
    const EXPIRY_TIME = 3 * 60 * 60 * 1000;
    return foodPins.filter(pin => now - new Date(pin.createdAt).getTime() < EXPIRY_TIME);
  };

  return (
    <Router>
      <nav style={{ padding: '1rem', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '20px' }}>🏠 Home</Link>
        <Link to="/about">ℹ️ About</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 style={{ textAlign: 'center' }}>🍛 ShareMyMeal</h1>
              <FoodForm
                onAdd={(formData) => {
                  if (!selectedLocation) return;
                  handleAddFood({ ...formData, ...selectedLocation });
                }}
                lat={selectedLocation?.lat || ""}
                lng={selectedLocation?.lng || ""}
              />
              <MapView foodPins={getValidPins()} onMapClick={setSelectedLocation} />
            </>
          }
        />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;

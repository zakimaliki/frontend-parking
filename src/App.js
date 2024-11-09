import React, { useState } from "react";
import ParkingMap from "./components/ParkingMap";
import FormCheckout from "./components/FormCheckout";

const App = () => {
  const [refreshParkingMap, setRefreshParkingMap] = useState(false);

  const handleCheckoutComplete = () => {
    setRefreshParkingMap(!refreshParkingMap); // Toggle untuk memicu pembaruan di ParkingMap
  };

  return (
    <div className="container mt-5 text-center">
      <h1 className="text-center mb-4">Parking Management System</h1>
      <p><strong>Klik slot <span className="text-success">hijau</span> untuk booking parkir. <br/>Slot <span className="text-danger">hijau</span> berarti sudah terisi.</strong></p>
      <FormCheckout onCheckoutComplete={handleCheckoutComplete} />
      <ParkingMap refresh={refreshParkingMap} />
    </div>
  );
};

export default App;

import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const FormCheckout = ({ onCheckoutComplete }) => {
  const [checkoutCarNumber, setCheckoutCarNumber] = useState("");
  const [parkingFee, setParkingFee] = useState(null);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:80/reservationForms`);
      const reservations = await response.json();
      const booking = reservations.find((res) => res.vehicle_number === checkoutCarNumber);

      if (booking) {
        const startTime = new Date(booking.start_time);
        const endTime = new Date();
        const parkingDuration = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
        const originalDuration = parseInt(booking.parking_duration);

        let fee;
        if (parkingDuration > originalDuration) {
          const overtime = parkingDuration - originalDuration;
          fee = (originalDuration * 2000) + (overtime * 4000);
        } else {
          fee = parkingDuration * 2000;
        }

        setParkingFee(fee);
        setCheckoutDetails({
          name: booking.name,
          vehicle_number: booking.vehicle_number,
          slot_id: booking.slot_id,
          start_time: booking.start_time,
          end_time: endTime.toISOString(),
          fee,
        });
        setShowCheckoutModal(true);

        await fetch(`http://localhost:80/parkingSlots/${booking.slot_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: false }),
        });

        await fetch(`http://localhost:80/reservationForms/${booking.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        // Panggil fungsi onCheckoutComplete untuk memberi tahu bahwa checkout selesai
        if (onCheckoutComplete) {
          onCheckoutComplete();
          setCheckoutCarNumber("")
        }
        setShowCheckoutModal(true);
      }else{
        alert("Nomor kendaraan tidak ditemukan.")
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="mt-4 text-center">
      <Form onSubmit={handleCheckout} className="d-flex justify-content-center align-items-center">
        <Form.Label className="me-2 fw-bold">Nomor Kendaraan:</Form.Label>
        <Form.Control
          type="text"
          value={checkoutCarNumber}
          onChange={(e) => setCheckoutCarNumber(e.target.value)}
          required
          placeholder="Nomor Kendaraan"
          className="w-auto me-2"
        />
        <Button variant="primary" type="submit">Checkout</Button>
      </Form>

      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout Berhasil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkoutDetails ? (
            <>
              <p><strong>Nama:</strong> {checkoutDetails.name}</p>
              <p><strong>Nomor Kendaraan:</strong> {checkoutDetails.vehicle_number}</p>
              <p><strong>Slot Parkir:</strong> {checkoutDetails.slot_id}</p>
              <p><strong>Waktu Masuk:</strong> {new Date(checkoutDetails.start_time).toLocaleString()}</p>
              <p><strong>Waktu Keluar:</strong> {new Date(checkoutDetails.end_time).toLocaleString()}</p>
              <p><strong>Biaya Parkir:</strong> Rp {checkoutDetails.fee}</p>
            </>
          ) : (
            <p>Nomor kendaraan tidak ditemukan.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FormCheckout;

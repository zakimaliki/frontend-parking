import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import { Modal, Button, Form } from "react-bootstrap";
import carImage from "../assets/images/car.png";

const ParkingMap = ({ refresh }) => {
  const [carImg, setCarImg] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const loadParkingSlots = async () => {
      try {
        const response = await fetch("http://localhost:80/parkingSlots");
        const data = await response.json();
        setSlots(data.map((slot) => ({ ...slot, occupied: slot.status })));
      } catch (error) {
        console.error("Error loading parking slots:", error);
      }
    };

    loadParkingSlots();

    const image = new window.Image();
    image.src = carImage;
    image.onload = () => {
      setCarImg(image);
    };
  }, [refresh]); // Refresh data ketika prop refresh berubah

  const handleSlotClick = (slot) => {
    if (!slot.occupied) {
      setSelectedSlot(slot);
      setShowModal(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const newBooking = {
      name,
      vehicle_number: carNumber,
      parking_duration: duration,
      slot_id: selectedSlot.id,
      start_time: new Date().toISOString(),
    };

    try {
      await fetch("http://localhost:80/reservationForms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      await fetch(`http://localhost:80/parkingSlots/${selectedSlot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: true }),
      });

      setName("")
      setDuration("")
      setCarNumber("")

      setSlots(
        slots.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, occupied: true } : slot
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Stage width={800} height={window.innerHeight}>
          <Layer>
            {slots.map((slot) =>
              slot.occupied && carImg ? (
                <Image
                  key={`car-${slot.id}`}
                  x={slot.x + 0}
                  y={slot.y + 10}
                  width={60}
                  height={75}
                  image={carImg}
                />
              ) : null
            )}
            {slots.map((slot) => (
              <Rect
                key={slot.id}
                x={slot.x}
                y={slot.y}
                width={60}
                height={90}
                fill={slot.occupied ? "red" : "green"}
                opacity={0.5}
                onClick={() => handleSlotClick(slot)}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Formulir Pemesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="carNumber" className="mt-3">
              <Form.Label>Nomor Kendaraan</Form.Label>
              <Form.Control
                type="text"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="duration" className="mt-3">
              <Form.Label>Durasi Parkir (jam)</Form.Label>
              <Form.Control
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4">
              Pesan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ParkingMap;

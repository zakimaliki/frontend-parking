export const calculateParkingFee = (startTime, endTime, originalDuration) => {
    const parkingDuration = Math.ceil((endTime - new Date(startTime)) / (1000 * 60 * 60));
    
    let fee;
    if (parkingDuration > originalDuration) {
      const overtime = parkingDuration - originalDuration;
      fee = (originalDuration * 2000) + (overtime * 4000);
    } else {
      fee = parkingDuration * 2000;
    }
    
    return {
      fee,
      parkingDuration
    };
  };
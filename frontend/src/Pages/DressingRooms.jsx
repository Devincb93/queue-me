import React, { useState, useEffect } from 'react';
import EditQueuePage from './EditQueuePage';


const DressingRooms = () => {
  const initialRooms = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
  };

  const [rooms, setRooms] = useState(initialRooms);
  const [showEditQueue, setShowEditQueue] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/dressing_room');
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched room data:", data);

          // Create a clean state based on initialRooms
          let updatedRooms = { ...initialRooms };

          // Only update rooms that have occupants
          data.forEach(room => {
            if (updatedRooms.hasOwnProperty(room.room_number)) {
              updatedRooms[room.room_number] = room.customer_name || null;
            }
          });

          setRooms(updatedRooms);
        } else {
          console.error("Failed to fetch rooms:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomClick = async (roomNumber) => {
    try {
      if (rooms[roomNumber] !== null) {
        const response = await fetch(`http://127.0.0.1:5555/dressing_room/${roomNumber}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const data = await response.json();
          setRooms(prev => ({ ...prev, [roomNumber]: null }));
          console.log(data.message);
        } else {
          const errorData = await response.json();
          console.error("Failed to vacate room:", errorData.error || response.statusText);
        }
      } else {
        const response = await fetch(`http://127.0.0.1:5555/dressing_room/${roomNumber}`, {
          method: 'PUT',
        });
        if (response.ok) {
          const data = await response.json();
          setRooms(prev => ({ ...prev, [roomNumber]: data.customer_name }));
        } else {
          const errorData = await response.json();
          console.error("Failed to occupy room:", errorData.error || response.statusText);
        }
      }
    } catch (error) {
      console.error("Error handling room click:", error);
    }
  };

  return (
    <div>
      <h1 className='border-top-32 relative text-center'>Dressing Rooms</h1>
      <div className="grid grid-cols-3 h-screen m-16 justify-items-center -mt-0 p-6">
        {Object.keys(rooms).map((room) => (
          <div
            key={room}
            className={`bg-pink-400 w-24 h-16 text-center rounded-lg text-lg mt-4 ${rooms[room] ? 'occupied' : ''}`}
            onClick={() => handleRoomClick(room)}
          >
            {rooms[room] ? `Occupied by: ${rooms[room]}` : `Room ${room}`}
          </div>
        ))}
      </div>
      {showEditQueue && <EditQueuePage someProp={rooms} />}
    </div>
  );
};

export default DressingRooms;
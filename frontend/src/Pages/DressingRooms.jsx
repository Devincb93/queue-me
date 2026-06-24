import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DressingRoom = ({ room, onRoomClick }) => {
    const { number, customer_name } = room;
    const isOccupied = !!customer_name;

    return (
        <div
            className={`
                p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 
                flex flex-col items-center justify-center aspect-square
                ${isOccupied ? 'bg-gray-800 text-white' : 'bg-white hover:bg-gray-100'}
            `}
            onClick={() => onRoomClick(number)}
        >
            <span className="text-2xl font-bold">{number}</span>
            <span className="text-sm mt-2 text-center">{isOccupied ? customer_name : 'Available'}</span>
        </div>
    );
};


const DressingRooms = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/dressing_room');
                if (response.ok) {
                    const data = await response.json();

                    const initialRooms = Array.from({ length: 8 }, (_, i) => ({
                        number: i + 1,
                        customer_name: null,
                    }));

                    data.forEach(room => {
                        const index = initialRooms.findIndex(r => r.number === room.room_number);
                        if (index !== -1) {
                            initialRooms[index].customer_name = room.customer_name;
                        }
                    });

                    setRooms(initialRooms);
                } else {
                    toast.error("Failed to fetch rooms.");
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
                toast.error("An error occurred while fetching rooms.");
            }
        };
        fetchRooms();
    }, []);

    const handleRoomClick = async (roomNumber) => {
        const room = rooms.find(r => r.number === roomNumber);
        if (!room) return;

        const isOccupied = !!room.customer_name;
        const method = isOccupied ? 'DELETE' : 'PUT';

        try {
            const response = await fetch(`http://127.0.0.1:5555/dressing_room/${roomNumber}`, { method });
            const data = await response.json();

            if (response.ok) {
                setRooms(prevRooms => prevRooms.map(r => 
                    r.number === roomNumber ? { ...r, customer_name: isOccupied ? null : data.customer_name } : r
                ));
                toast.success(isOccupied ? `Room ${roomNumber} is now available.` : `Customer in Room ${roomNumber}.`);
            } else {
                toast.error(data.error || `Failed to update room ${roomNumber}.`);
            }
        } catch (error) {
            console.error("Error handling room click:", error);
            toast.error("An error occurred while updating the room.");
        }
    };

    return (
        <div className="bg-gray-50 p-4 md:p-8 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dressing Rooms</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                {rooms.map((room) => (
                    <DressingRoom key={room.number} room={room} onRoomClick={handleRoomClick} />
                ))}
            </div>
        </div>
    );
};

export default DressingRooms;
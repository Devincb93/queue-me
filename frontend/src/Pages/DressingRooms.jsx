import React from 'react';


const DressingRooms = () => {
  return (
    <div className="dressing-room-container">
      {/* Left side dressing rooms */}
      <div className="dressing-rooms-left">
        <div className="dressing-room">Room 1</div>
        <div className="dressing-room">Room 2</div>
        <div className="dressing-room">Room 3</div>
        <div className='dressing-room'>Room 4</div>
      </div>
      
      {/* Hallway */}
      <div className="hallway">
        <p>Hallway</p>
      </div>
      
      {/* Right side dressing rooms */}
      <div className="dressing-rooms-right">
        <div className="dressing-room">Room 5</div>
        <div className="dressing-room">Room 6</div>
        <div className="dressing-room">Room 7</div>
        <div className="dressing-room">Room 8</div>
      </div>
    </div>
  );
};

export default DressingRooms;
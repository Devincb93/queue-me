import React from 'react';


const DressingRooms = () => {
  return (
    <div>
      <h1 className='text-center border-top-32 '>DressingRooms</h1>
  
    
    <div className="   grid grid-cols-3 h-screen  m-16 justify-items-center -mt-0" >
          

      
      {/* Left side dressing rooms */}
      <div className='flex flex-col justify-center items-center ml-64 md:*: '>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 4</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 3</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 2</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 1</div>
      </div>
      
      {/* Hallway */}
      <div className='flex flex-col justify-center items-center -mt-68'>
        <div className='bg-pink-500 w-32 h-64 text-center text-white py-2 rounded-lg'>Hallway</div>
        

        
      </div>
      
      {/* Right side dressing rooms */}
      <div className='flex flex-col justify-center items-center mr-64'>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 5</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 6</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 7</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 8</div>
      </div>
    </div>
    </div>
  );
};

export default DressingRooms;
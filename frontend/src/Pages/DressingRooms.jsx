import React from 'react';


const DressingRooms = () => {
  return (
    <div>
      <h1 className=' border-top-32 fixed  '>DressingRooms</h1>
      
    <div className="   grid grid-cols-3 h-screen  m-16 justify-items-center -mt-0 p-6" >
      
      {/*Change break point of dressing rooms for when sizing goes down app doesn't break*/}
      <div className='flex flex-col justify-center items-center fixed pr-80'>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4 '>Room 4</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 3</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4'>Room 2</div>
        <div className='bg-pink-400 w-32 h-24 text-center rounded-lg text-lg mt-4 '>Room 1</div>
      </div>
      <div className='flex flex-col justify-center items-center fixed pt-4 '>
        <div className='bg-pink-500 w-32 h-64 text-center text-white  rounded-lg h-96'>Hallway</div>
      </div>
      <div className='flex flex-col justify-center items-center fixed pl-80'>
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
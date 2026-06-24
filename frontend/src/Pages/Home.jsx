import React from 'react';
import Login from './Login';
import { ToastContainer } from 'react-toastify';

function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center font-sans">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-gray-800 tracking-heading-tight">QueueMe</h1>
                <p className="text-base text-gray-600 mt-2 tracking-normal">The seamless way to manage your customers.</p>
            </div>
            <Login />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
} 

export default Home;
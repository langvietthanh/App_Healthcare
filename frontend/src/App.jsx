import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          App Healthcare
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Frontend đã sẵn sàng! React + Vite + Tailwind CSS.
        </p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300">
          Bắt đầu Code
        </button>
      </div>
    </div>
  );
}

export default App;

import React from "react";

const PlacementSelection = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-96">
        <h2 className="text-purple-800 text-2xl font-bold mb-5">
          Choose Placement Type
        </h2>
        <button
          className="w-full py-3 mb-3 bg-purple-700 text-white text-lg font-semibold rounded-lg transition hover:bg-purple-900"
          onClick={() => window.location.href = "/oncampus"}
        >
          On-Campus
        </button>
        <button
          className="w-full py-3 bg-purple-700 text-white text-lg font-semibold rounded-lg transition hover:bg-purple-900"
          onClick={() => window.location.href = "/offcampus"}
        >
          Off-Campus
        </button>
      </div>
    </div>
  );
};

export default PlacementSelection;
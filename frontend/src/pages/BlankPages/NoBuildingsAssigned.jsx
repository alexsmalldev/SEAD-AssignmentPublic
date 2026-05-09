// External libraries
import React from 'react';

const NoBuildingsAssigned = () => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">No Buildings Assigned</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">No Buildings have assigned to you, please wait for your System Administrator to assign or request Help</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
        </div>
      </div>
    </main>
  );
};

export default NoBuildingsAssigned;

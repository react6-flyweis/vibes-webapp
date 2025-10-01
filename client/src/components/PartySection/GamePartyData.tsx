import React from "react";

export default function GamePartyData() {
  return (
    <div
      className="relative w-full max-w-[864px] mx-auto mt-5 rounded-2xl shadow-[0_0_100px_rgba(250,204,21,0.4),0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 md:p-10 flex flex-col items-center text-center"
      style={{
        background:
          "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)",
      }}
    >
      {/* Heading */}
      <h2 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-snug">
        🎉 Start Planning Your Dream Party!
      </h2>

      {/* Description */}
      <p className="mt-4 text-white opacity-90 text-base sm:text-lg leading-6 max-w-[700px]">
        Create unforgettable events with our all-in-one party planning platform.
        From intimate gatherings to grand celebrations!
      </p>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <button className="w-full sm:w-auto px-6 py-3 bg-white bg-opacity-90 rounded-md shadow-lg text-purple-800 font-semibold flex items-center justify-center gap-2">
          <span className="w-4 h-4 border border-purple-700 rounded-sm"></span>
          Create Your Event Now
        </button>
        <button className="w-full sm:w-auto px-6 py-3 bg-white bg-opacity-90 border border-white/30 rounded-md shadow-lg text-purple-800 font-semibold flex items-center justify-center gap-2">
          <span className="w-4 h-4 border border-purple-700 rounded-sm"></span>
          AI Party Designer
        </button>
      </div>

      {/* Bottom labels with SVG icons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-white opacity-90 text-sm">
        <div className="flex items-center gap-2">
          {/* Calendar Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Event Planning</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Users Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Guest Management</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sparkles Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l1.5 3L10 12l-3.5 1L5 16l-1.5-3L0 12l3.5-1L5 8zm14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zm-8-10l1.5 3L14 6l-3.5 1L10 10l-1.5-3L5 6l3.5-1L10 2z" />
          </svg>
          <span>AI-Powered Tools</span>
        </div>
      </div>
    </div>
  );
}

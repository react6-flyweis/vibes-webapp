import React from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router";

const Footer = () => {
  const locationObj = useLocation();
  const location = locationObj.pathname;

  const isHome: boolean = location === "/";
  return (
    <footer
      className={`relative w-full h-auto md:h-[275px] bg-linear-to-r from-slate-900 to-gray-900 overflow-hidden 
      ${isHome ? "rounded-t-[60px]" : ""}`}
    >
      {" "}
      {/* Background blur effects */}
      <div className="absolute w-[647px] h-[639px] -right-[200px] -top-16 bg-gray-400 opacity-30 rounded-full blur-[192px]"></div>
      <div className="absolute w-[647px] h-[639px] -left-[313px] -top-[320px] bg-gray-400 opacity-30 rounded-full blur-[192px]"></div>
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[75px] py-8 md:py-0 text-center md:text-left gap-8 md:gap-0">
        {/* Left side - Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h1
            className="text-4xl md:text-6xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "serif" }}
          >
            Vibes Studio
          </h1>
          <p className="text-white text-lg md:text-2xl font-medium">
            Wedding & Event Planner
          </p>
        </div>

        {/* Right side - Social media */}
        <div className="flex space-x-5 md:space-x-0 md:flex-col md:space-y-5 items-center justify-center">
          {/* Instagram */}
          <a
            href="#"
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#EFDBDD] hover:scale-110 transition"
          >
            <FaInstagram size={24} className="md:size-[28px] text-pink-600" />
          </a>

          {/* Facebook */}
          <a
            href="#"
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#D7F5FE] hover:scale-110 transition"
          >
            <FaFacebookF size={22} className="md:size-[26px] text-blue-600" />
          </a>

          {/* WhatsApp */}
          <a
            href="#"
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#DDFFEB] hover:scale-110 transition"
          >
            <FaWhatsapp size={24} className="md:size-[28px] text-green-500" />
          </a>
        </div>
      </div>
      {/* Center - Copyright (large screen same position, mobile still centered) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm md:text-lg font-light">
        © cr.camayo 2025
      </div>
      {/* Left dot pattern */}
      <div className="hidden md:block absolute -left-28 top-28">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={`left-${index}`}
              className="w-5 h-5 bg-white rounded-full opacity-80"
            ></div>
          ))}
        </div>
      </div>
      {/* Right dot pattern */}
      <div className="hidden md:block absolute right-72 -bottom-2">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={`right-${index}`}
              className="w-5 h-5 bg-white rounded-full opacity-80"
            ></div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

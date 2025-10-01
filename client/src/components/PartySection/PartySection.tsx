import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import bgImage from "../../../assests/1.png";
import bgImage2 from "../../../assests/2.png";
import NightlifeGallery from "./NightlifeGallery";
import GamePartyData from "./GamePartyData";

export default function PartySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center z-0"
      style={{
        background:
          "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)",
      }}
    >
      {/* ===== Desktop layout ===== */}
      <div className="hidden md:block w-full h-full">
        <img
          src={bgImage}
          alt="Background 1"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden md:absolute md:inset-0 md:flex md:justify-center pointer-events-auto">
        <NightlifeGallery />
      </div>

      {/* ===== Mobile layout ===== */}
      <div className="block md:hidden w-full bg-[#0C111F]">
        {/* Nightlife Gallery */}
        <div className="w-full px-4 py-6 flex justify-center">
          <NightlifeGallery />
        </div>

        {/* GamePartyData in normal flow */}
        <div className="w-full px-4 py-6 flex justify-center">
          <GamePartyData />
        </div>
      </div>

      {/* ===== Second section (Desktop only) ===== */}
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          delay: 0.2,
          duration: 1,
          ease: "easeInOut",
        }}
        className="relative w-full hidden md:block"
      >
        {/* Second background image */}
        <img
          src={bgImage2}
          alt="Background 2"
          className="w-full object-cover md:h-auto"
        />

        {/* GamePartyData in absolute center for desktop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-2 md:px-0">
          <GamePartyData />
        </div>
      </motion.div>
    </div>
  );
}

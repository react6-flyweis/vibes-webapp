import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import eventImageUrl from '../../../assests/bg.jpg';
import EllipseImg from '../../../assests/Ellipse.png';
import borderimg from '../../../assests/border.png';
import { Link } from "wouter";

const slides = [
    {
        title: 'Vibrant Nightlife',
        description: 'Experience the best events with an electrifying atmosphere.',
        image: eventImageUrl,
    },
    {
        title: 'Live Concerts',
        description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        image: eventImageUrl,
    },
    {
        title: 'Exclusive Parties',
        description:
            'Plan, host, and attend unforgettable events with AI-powered tools.',
        image: eventImageUrl,
    },
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        // MODIFICATION: Added max-h-screen to prevent layout issues on mobile.
        <div className="relative h-screen min-h-screen w-full bg-[#0C111F] font-sans text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute top-0 right-0 h-full w-full md:w-[65%]">
                <img
                    src={eventImageUrl}
                    alt="Event crowd"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Decorative Background Elements */}
            <img src={borderimg} className="absolute w-full h-full z-10" alt="Decorative Border" />
            <img src={EllipseImg} className="w-[838.4628295898438px] absolute left-0 z-10" alt="Decorative Ellipse" />
            <div></div>
            {/* Gradient Overlay */}
            {/* MODIFICATION: Adjusted gradient for better look on mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C111F] from-50% md:from-40% via-[rgba(12,17,31,0.8)] to-transparent"></div>

            {/* Content */}
            {/* MODIFICATION: Changed from flex row to flex column on mobile, and back to row on md screens. Adjusted padding/margin for mobile. */}
            <div className="relative z-10 flex flex-col md:flex-row h-full max-w-7xl mx-auto pt-24 md:pt-28 px-4 sm:px-8 md:px-16">
                
                {/* Left Side */}
                {/* MODIFICATION: Centered text for mobile view */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-8 py-2.5 backdrop-blur-sm">
                        <span className="text-xs font-medium">Welcome back, John!</span>
                    </div>

                    {/* MODIFICATION: Adjusted font size for mobile */}
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight lg:truncate">
                        Ready to create amazing
                        <br /> <span
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #FDE047 0%, #F9A8D4 50%, #FFFFFF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: 'bold',
                            }}
                        >
                            experiences
                        </span>?
                    </h1>

                    <p className="mt-6 max-w-lg text-base md:text-lg text-gray-300">
                        Plan, host, and attend unforgettable events with AI-powered tools
                        and immersive features.
                    </p>

                    {/* MODIFICATION: Buttons stack on mobile and are centered. */}
                    <div className="lg:mt-48  mt-10 flex flex-col sm:flex-row items-center gap-4">
                       <Link href="/create-event" className="flex items-center justify-center gap-3 rounded-full
                                w-[285px] h-[72px] text-black shadow-lg shadow-yellow-400/20
                                bg-gradient-to-r from-yellow-300 to-yellow-500
                                hover:from-purple-700 hover:via-pink-600 hover:to-orange-400
                                transition-colors duration-300">
                            <span className="font-semibold text-md 2xl:text-[24px]">Create Event</span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                                <ArrowRight className="h-4 w-4 text-yellow-400" />
                            </span>
                        </Link>

                        <Link href="/find-events" className="flex items-center justify-center gap-3 rounded-full
                                w-[285px] h-[72px] text-black shadow-lg shadow-yellow-400/20
                                bg-gradient-to-r from-yellow-300 to-yellow-500
                                hover:from-purple-700 hover:via-pink-600 hover:to-orange-400
                                transition-colors duration-300">
                            <span className="font-semibold">Discover Events</span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                                <ArrowRight className="h-4 w-4 text-yellow-400" />
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Slider */}
                {/* MODIFICATION: Removed fixed margin-left and let flexbox handle spacing. Added top margin for mobile. */}
                <div className="relative flex justify-center items-center flex-1 mt-8 md:mt-0">
                    {/* Prev */}
                    {/* MODIFICATION: Repositioned for mobile/tablet */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-custom-gradient backdrop-blur-sm transition-transform hover:scale-110"
                    >
                        <ArrowRight className="h-6 w-6 text-black transform rotate-180" />
                    </button>

                
                    <div
                        className="overflow-hidden w-[85vw] lg:mt-48 md:h-[800px] sm:mb-10"
                        style={{ maxWidth: '436px' }} // Max width remains the same for large screens
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {slides.map((slide, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-2">
                                    <div
                                        className="bg-white text-black shadow-2xl overflow-hidden rounded-[69px] lg:w-[436px]"
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            // MODIFICATION: Set an aspect ratio for better responsive images
                                            className="w-full h-auto object-cover  rounded-t-[69px] aspect-[4/3] md:aspect-auto md:h-[397px]"
                                        />
                                        <div className="p-4 md:p-6">
                                            <h3 className="text-lg md:text-xl font-bold">{slide.title}</h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {slide.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next */}
                    {/* MODIFICATION: Repositioned for mobile/tablet */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-custom-gradient backdrop-blur-sm transition-transform hover:scale-110"
                    >
                        <ArrowRight className="h-6 w-6 text-black" />
                    </button>
                </div>
            </div>

            {/* Bottom Button */}
            {/* MODIFICATION: Hide button on very small screens to prevent overlap, or adjust its size. Here we hide it. */}
            <div className="absolute bottom-[0px] left-1/2  -translate-x-1/2 hidden sm:block">
                <button className="group flex h-[106px] w-[150px] flex-col items-center justify-center rounded-[40px] bg-yellow-400 text-black shadow-lg shadow-yellow-400/30">
                   <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                        <ArrowRight className="h-4 w-4 text-yellow-400 rotate-90" />
                   </span>
                    <span className="text-[24px] font-bold">Mas Info</span>
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
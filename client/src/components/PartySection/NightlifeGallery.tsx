import React from 'react';
import imgae1 from '../../../assests/p3.jpg'
import imgae2 from '../../../assests/p1.jpg'
import imgae3 from '../../../assests/p2.jpg'
import imgae4 from '../../../assests/p4.jpg'

// Data for the image cards.
const imageData = [
  {
    id: 1,
    url: imgae1,
    alt: 'Crowd at a music concert',
    title: 'AI Party Designer',
    subtitle: 'Let AI design Your event',
  },
  {
    id: 2,
    url: imgae2,
    alt: 'People dancing at a party',
    title: 'Nightlife Vibes',
    subtitle: 'Experience unforgettable nights',
  },
  {
    id: 3,
    url: imgae3,
    alt: 'DJ performing at a nightclub',
    title: 'Live DJ Shows',
    subtitle: 'Feel the beat all night long',
  },
  {
    id: 4,
    url: imgae4,
    alt: 'Neon sign in a club',
    title: 'Neon Nights',
    subtitle: 'Bright lights, big fun',
  },
];

const NightlifeGallery = () => {
  return (
    <div className="relative max-w-7xl min-h-screen flex p-4 overflow-visible pt-20 lg:mt-40">
      {/* Animation styles */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-60px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          .card-float-animation {
            animation: float 2.5s ease-in-out infinite;
          }
        `}
      </style>

      {/* Image Cards */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 mx-auto">
        {imageData.map((image, index) => (
          <div
            key={image.id}
            className="relative group card-float-animation w-48 h-72 md:w-56 md:h-80 rounded-full overflow-hidden border-4 border-gray-800 transition-all duration-300 ease-in-out hover:scale-105"
            style={{
              animationDelay: `${index * 300}ms`,
              boxShadow: '0px 15px 26px 0px #D9D9D947',
            }}
          >
            {/* Image */}
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover relative z-0"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/50 
              opacity-100 md:opacity-0 md:group-hover:opacity-100 
              transition-opacity duration-500 z-10 px-4">
              <h3 className="text-lg font-bold">{image.title}</h3>
              <p className="text-sm mt-2">{image.subtitle}</p>
              <button className="mt-4 px-4 py-1 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NightlifeGallery;

const LogoHeart: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21C12 21 4 13.75 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.09C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.75 16 21 16 21H12Z"
          />
        </svg>
      </div>
      <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Vibes
      </span>
    </div>
  );
};

export default LogoHeart;

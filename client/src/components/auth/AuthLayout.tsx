import userAuthImage from "@/assets/images/user-auth.svg";
// import vendorAuthImage from "@/assets/images/vendor-auth.svg";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-12 bg-gradient-primary">
      {/* Content column */}
      <div className="col-span-12 md:col-span-6 flex flex-col justify-center h-full overflow-y-auto p-6 md:p-12 bg-white">
        {children}
      </div>

      {/* Illustration column */}
      <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center p-6 md:p-12">
        <img
          src={userAuthImage}
          alt="Authentication illustration"
          className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[520px] h-auto object-contain"
          aria-hidden="false"
        />
      </div>
    </div>
  );
}

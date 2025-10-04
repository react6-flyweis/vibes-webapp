import userAuthImage from "@/assets/images/user-auth.svg";
import vendorAuthImage from "@/assets/images/vendor-auth.svg";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-cols-12 bg-gradient-primary">
      <div className="col-span-12 md:col-span-6 flex flex-col justify-center h-full overflow-y-auto  p-8 bg-white">
        {children}
      </div>
      <div className="col-span-12 md:col-span-6 flex flex-col justify-center items-center p-8">
        <img src={userAuthImage} className="" />
      </div>
    </div>
  );
}

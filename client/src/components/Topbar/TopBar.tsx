import { Button } from "../ui/button";
import UserMenu from "../UserMenu";
import LogoHeart from "./LogoHeart";

const Topbar: React.FC = () => {
  return (
    <nav className="w-full h-12 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700shadow p-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-full">
        <LogoHeart />

        <div className="flex gap-5">
          <Button variant="outline">Login</Button>
          <Button className="bg-gradient-cta">Sign Up</Button>
        </div>

        {/* <UserMenu /> */}
      </div>
    </nav>
  );
};

export default Topbar;

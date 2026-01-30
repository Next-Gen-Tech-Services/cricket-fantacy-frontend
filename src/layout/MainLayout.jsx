import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BottomNavigation from "../components/BottomNavigation";
import MobileHeader from "../components/MobileHeader";

export default function MainLayout() {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      
      {/* Main Content */}
      <div className={isContactPage ? "" : "min-h-screen"}>
        <Outlet />
      </div>
      
      {/* Footer - Hidden on mobile when bottom nav is present */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}

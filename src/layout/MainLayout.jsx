import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BottomNavigation from "../components/BottomNavigation";
import MobileHeader from "../components/MobileHeader";
import { FooterAreaAd, MobileBottomBanner } from "../components/ads/index.jsx";

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
      
      {/* Footer Area Advertisement - Simple banner with image */}
      <FooterAreaAd 
        redirectUrl="https://cricketloversglobal.com/ticketdetails/692976e80b3853c713fa794c"
        className="hidden md:block"
      />
      
      {/* Footer - Hidden on mobile when bottom nav is present */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Bottom Banner - Simple mobile ad */}
      <MobileBottomBanner 
        redirectUrl="https://cricketloversglobal.com/ticketdetails/692976e80b3853c713fa794c"
      />
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}

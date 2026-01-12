import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LiveMatchBanner from "../components/LiveMatchBanner";

export default function MainLayout() {
  return (
    <>
      <LiveMatchBanner/>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

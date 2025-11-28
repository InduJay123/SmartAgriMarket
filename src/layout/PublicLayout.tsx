import { Outlet } from "react-router-dom";
import Navbar from "../scenes/navbar";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

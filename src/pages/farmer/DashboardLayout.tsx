import AlertNotifications from "./AlertNotification";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AlertNotifications />  {/* 🔔 alerts always active */}
      {children}
    </>
  );
};

export default DashboardLayout;

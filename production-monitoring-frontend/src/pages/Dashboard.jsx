import DashboardCards from "../components/dashboard/DashboardCards";
import ProductionCharts from "../components/dashboard/ProductionCharts";

function Dashboard() {
  return (
    <>
      <h2>Production Dashboard</h2>
      <DashboardCards />
      <ProductionCharts />
    </>
  );
}

export default Dashboard;

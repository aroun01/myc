import React, { useEffect, useState } from "react";
import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.scss";
import StatisticsNav from "../../StaticsNav";

const Home = () => {
  const [currentPeriod, setCurrentPeriod] = useState("all");
  const [viewsStats, setViewsStats] = useState(null);

  useEffect(() => {
    const fetchStats = async (period) => {
      try {
        const response = await fetch(
          `/api/api/views-stats?period=${period}`
        );
        const data = await response.json();
        setViewsStats(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats(currentPeriod);
  }, [currentPeriod]);

  const handlePeriodChange = (e) => {
    setCurrentPeriod(e.target.value);
  };

  return (
    <div>
      <StatisticsNav />
      <div className="homePage">
        <FeaturedInfo />
        <div
          style={{
            marginLeft: "85%",
            marginRight: "3%",
            marginBottom: "-4%",
            marginTop: "3%",
            padding: "10px",
            backgroundColor: "white",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
          }}
        >
          <select value={currentPeriod} onChange={handlePeriodChange}>
            <option value="all">All</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <Chart
          data={viewsStats}
          dataKey={"Просмотров"}
          grid={true}
          title={"Статистика просмотров"}
        />
      </div>
    </div>
  );
};

export default Home;

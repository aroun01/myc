import "./featuredInfo.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";

const FeaturedInfo = () => {
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [lastMonthPlaces, setLastMonthPlaces] = useState(0);
  const [lastWeekPlaces, setLastWeekPlaces] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос общего количества мест
        const totalRes = await axios.get("/places-count");
        setTotalPlaces(totalRes.data.count);

        // Запрос количества мест за последний месяц
        const monthRes = await axios.get("/places-count?period=month");
        setLastMonthPlaces(monthRes.data.count);

        // Запрос количества мест за последнюю неделю
        const weekRes = await axios.get("/places-count?period=week");
        setLastWeekPlaces(weekRes.data.count);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="featuredInfoComponent">
      <div className="item">
        <span className="title">Total Posts</span>
        <div>
          <span className="money">{totalPlaces}</span>
        </div>
        <span className="sub">Compared to last month</span>
      </div>

      <div className="item">
        <span className="title">Posts Last Month</span>
        <div>
          <span className="money">{lastMonthPlaces}</span>
        </div>
        <span className="sub">Compared to last month</span>
      </div>

      <div className="item">
        <span className="title">Posts Last Week</span>
        <div>
          <span className="money">{lastWeekPlaces}</span>
        </div>
        <span className="sub">Compared to last month</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;

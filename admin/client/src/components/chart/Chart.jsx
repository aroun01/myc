import "./chart.scss";

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ title, data, dataKey, grid }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="chartComponent">
      <h3>{title}</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" aspect={4 / 1}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#5550bd" />
            <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
            <Tooltip />
            {grid && <CartesianGrid stroke="#d4d4d4" strokeDasharray={"5 5"} />}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="notfound_text">Информация не найдена</p>
      )}
    </div>
  );
};

export default Chart;

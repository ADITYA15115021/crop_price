import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SERIES_COLORS = ["#059669", "#2563eb", "#d97706", "#7c3aed", "#dc2626", "#0891b2"];

function PriceChart({ data }) {
  const seriesMap = {};

  data.forEach((record) => {
    const key = `${record.state} - ${record.crop}`;
    if (!seriesMap[key]) seriesMap[key] = {};
    seriesMap[key][record.date] = record.price;
  });

  const dates = [...new Set(data.map((record) => record.date))].sort();
  const chartData = dates.map((date) => {
    const point = { date };
    Object.entries(seriesMap).forEach(([key, values]) => {
      point[key] = values[date] ?? null;
    });
    return point;
  });
  const series = Object.keys(seriesMap);

  return (
    <section className="price-chart">
      <div className="price-chart__heading">
        <div>
          <p className="price-chart__eyebrow">Historical comparison</p>
          <h2>Price Trend</h2>
          <p>Track how selected crop prices change over time.</p>
        </div>
        <span className="price-chart__count">{series.length} series</span>
      </div>

      <div className="price-chart__canvas">
        <ResponsiveContainer width="100%" height={390}>
          <LineChart data={chartData} margin={{ top: 12, right: 18, left: 4, bottom: 6 }}>
            <CartesianGrid vertical={false} stroke="#dfe9e1" strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#607466", fontSize: 12 }}
              minTickGap={26}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#607466", fontSize: 12 }}
              width={58}
            />
            <Tooltip
              contentStyle={{ border: "1px solid #cfe0d2", borderRadius: "10px", boxShadow: "0 10px 28px rgba(30, 65, 38, .14)" }}
              labelStyle={{ color: "#24432d", fontWeight: 700, marginBottom: "6px" }}
              itemStyle={{ color: "#38513f", fontSize: "13px" }}
            />
            <Legend wrapperStyle={{ paddingTop: "18px", fontSize: "13px" }} />
            {series.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, fill: "#ffffff" }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PriceChart;

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = ({ header, colors, height, location, building, data, type }) => {
  const [state, setState] = useState({
    series: [
      {
        name: "Volume",
        data: [],
      },
    ],
    options: {
      chart: {
        type: `${type}`,
        height: `${height}`,
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      title: {
        text: `${building} - ${location}`,
        align: "left",
      },
      subtitle: {
        text: "Water Consumption Movements",
        align: "left",
      },
      markers: {
        // size: 6,
        // strokeWidth: 0,
        hover: {
          size: 8,
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          show: false, // Hide x-axis labels
        },
      },
      yaxis: {
        opposite: true,
      },
      legend: {
        horizontalAlign: "left",
      },
      tooltip: {
        x: {
          formatter: function (value) {
            const date = new Date(value);
            const month = date.toLocaleString("default", { month: "short" });
            const day = date.getDate();
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            let period = "AM";

            if (hours === 0) {
              hours = 12;
            } else if (hours === 12) {
              period = "PM";
            } else if (hours > 12) {
              hours -= 12;
              period = "PM";
            }

            return `${month} ${day}, ${year} ${
              hours < 10 ? "0" + hours : hours
            }:${minutes < 10 ? "0" + minutes : minutes}:${
              seconds < 10 ? "0" + seconds : seconds
            } ${period}`;
          },
        },
      },
      grid: {
        borderColor: "#f0f0f0",
      },
      // colors: [colors],
    },
    totalVolume: null,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const newData = data.map((item) => ({
        x: new Date(item.DateTime.seconds * 1000),
        y: item.volume,
      }));

      setState((prevState) => ({
        ...prevState,
        series: [{ data: newData }],
        // set total volume as the volume of the newest data
        totalVolume: newData[0].y,
      }));
    }
  }, [data]);

  return (
    <div className="head">
      <p className="header">{header}</p>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={type}
        height={height}
      />

      <div className="card-meta">
        <p className="text">Total</p>
        <p className="meta-value">{state.totalVolume}</p>
      </div>
    </div>
  );
};

export default Chart;

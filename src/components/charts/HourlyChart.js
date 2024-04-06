import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const HourlyChart = ({ colors, height, right, left, type }) => {
  const [state, setState] = useState({
    series: [
      {
        name: "Right",
        data: [],
      },
      {
        name: "Left",
        data: [],
      },
      {
        name: "Total",
        data: [], // Total volume data will be added here
      },
    ],
    options: {
      chart: {
        type: `${type}`,
        height: `${height}`,
        // maxHeight: "600px",
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
      markers: {
        hover: {
          size: 8,
        },
      },
      xaxis: {
        title: {
          text: "Time",
        },
        // categories: Object.keys(right).map((hourRange) => {
        //   const [start, end] = hourRange.split("-");
        //   return `${new Date(start).toLocaleString("en-US", {
        //     hour: "numeric",
        //     hour12: true,
        //   })}-${new Date(end).toLocaleString("en-US", {
        //     hour: "numeric",
        //     hour12: true,
        //   })}`;
        // }), // Format each hour range as 1AM-2AM
        categories: [
          "8AM-9AM",
          "9AM-10AM",
          "10AM-11AM",
          "11AM-12PM",
          "12PM-1PM",
          "1PM-2PM",
          "2PM-3PM",
          "3PM-4PM",
          "4PM-5PM",
          "5PM-6PM",
          "6PM-7PM",
          "7PM-8PM",
          "8PM-9PM",
          "9PM-10PM",
          "10PM-11PM",
          "11PM-12AM",
          "12AM-1AM",
          "1AM-2AM",
          "2AM-3AM",
          "3AM-4AM",
          "4AM-5AM",
          "5AM-6AM",
          "6AM-7AM",
          "7AM-8AM",
        ],
        labels: {
          style: {
            fontSize: "10px", // Adjust the font size here
          },
        },
      },
      yaxis: {
        title: {
          text: "Volume",
        },
        opposite: false,
        // labels: {
        //   formatter: function (value) {
        //     return parseInt(value);
        //   },
        // },
        labels: {
          style: {
            fontSize: "10px", // Adjust the font size here
          },
          formatter: function (value) {
            return value.toFixed(2); // Format volume to two decimal points
          },
        },
      },
      legend: {
        position: "top",
      },
      tooltip: {
        x: {},
      },
      grid: {
        borderColor: "#f0f0f0",
      },
      // colors: ["#ACE1AF", "#FBEC5D", "#FFbf00"],
      // colors: ["#2D4B8A", "#3C63C6", "#FFC100"],
    },
  });

  // useEffect(() => {
  //   const rightVolumes = Object.values(right).map((data) =>
  //     data.reduce((acc, curr) => acc + curr.volume, 0)
  //   );
  //   const leftVolumes = Object.values(left).map((data) =>
  //     data.reduce((acc, curr) => acc + curr.volume, 0)
  //   );
  //   setState((prevState) => ({
  //     ...prevState,
  //     series: [
  //       {
  //         ...prevState.series[0],
  //         data: rightVolumes,
  //       },
  //       {
  //         ...prevState.series[1],
  //         data: leftVolumes,
  //       },
  //     ],
  //   }));
  // }, [right, left]);

  // useEffect(() => {
  //   // Calculate total volume for each hour range
  //   const totalVolumes = Object.keys(right).map((hourRange, index) => {
  //     const totalRightVolume = right[hourRange].reduce(
  //       (acc, curr) => acc + curr.volume,
  //       0
  //     );
  //     const totalLeftVolume = left[hourRange].reduce(
  //       (acc, curr) => acc + curr.volume,
  //       0
  //     );
  //     return totalRightVolume + totalLeftVolume;
  //   });

  //   setState((prevState) => ({
  //     ...prevState,
  //     series: [
  //       {
  //         ...prevState.series[0],
  //         data: Object.values(right).map((data) =>
  //           data.reduce((acc, curr) => acc + curr.volume, 0)
  //         ),
  //       },
  //       {
  //         ...prevState.series[1],
  //         data: Object.values(left).map((data) =>
  //           data.reduce((acc, curr) => acc + curr.volume, 0)
  //         ),
  //       },
  //       {
  //         ...prevState.series[2],
  //         data: totalVolumes,
  //       },
  //     ],
  //   }));
  // }, [right, left]);

  // useEffect(() => {
  //   if (right && left) {
  //     // Calculate total volume for each hour range
  //     const totalVolumes = Object.keys(right).map((hourRange, index) => {
  //       const totalRightVolume = right[hourRange]?.reduce(
  //         (acc, curr) => acc + curr.volume,
  //         0
  //       );
  //       const totalLeftVolume = left[hourRange]?.reduce(
  //         (acc, curr) => acc + curr.volume,
  //         0
  //       );
  //       return (totalRightVolume || 0) + (totalLeftVolume || 0);
  //     });

  //     setState((prevState) => ({
  //       ...prevState,
  //       series: [
  //         {
  //           ...prevState.series[0],
  //           data: Object.values(right).map((data) =>
  //             (data || []).reduce((acc, curr) => acc + curr.volume, 0)
  //           ),
  //         },
  //         {
  //           ...prevState.series[1],
  //           data: Object.values(left).map((data) =>
  //             (data || []).reduce((acc, curr) => acc + curr.volume, 0)
  //           ),
  //         },
  //         {
  //           ...prevState.series[2],
  //           data: totalVolumes,
  //         },
  //       ],
  //     }));
  //   }
  // }, [right, left]);

  useEffect(() => {
    if (right && left) {
      // Calculate total volume for each hour range
      const totalVolumes = Object.keys(right).map((hourRange, index) => {
        const totalRightVolume = right[hourRange]?.reduce(
          (acc, curr) => acc + curr.volume,
          0
        );
        const totalLeftVolume = left[hourRange]?.reduce(
          (acc, curr) => acc + curr.volume,
          0
        );
        return (totalRightVolume || 0) + (totalLeftVolume || 0);
      });

      setState((prevState) => ({
        ...prevState,
        series: [
          {
            ...prevState.series[0],
            data: Object.values(right).map((data) =>
              (data || [])
                .reduce((acc, curr) => acc + curr.volume, 0)
                .toFixed(2)
            ),
          },
          {
            ...prevState.series[1],
            data: Object.values(left).map((data) =>
              (data || [])
                .reduce((acc, curr) => acc + curr.volume, 0)
                .toFixed(2)
            ),
          },
          {
            ...prevState.series[2],
            data: totalVolumes.map((volume) => volume.toFixed(2)),
          },
        ],
      }));
    }
  }, [right, left]);

  useEffect(() => {
    console.log("Right Data:", right);
    console.log("Left Data:", left);
  }, [right, left]);

  return (
    <div className="head">
      {/* <p className="header">{header}</p>
      <p className="reminder">
        Please be advised that data collection for the selected date begins at
        8AM and concludes at 8AM the following day.
      </p> */}
      <ReactApexChart
        options={state.options}
        series={state.series}
        type={type}
        height={height}
      />
      {/* extra data */}
      {/* <div className="card-meta">
        <p className="text">Total</p>
        <p className="meta-value">0</p>
      </div> */}
      {/* extra data */}
    </div>
  );
};

export default HourlyChart;

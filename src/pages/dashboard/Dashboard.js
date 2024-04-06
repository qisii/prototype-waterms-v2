import { Link } from "react-router-dom";
import Sidebar from "../../components/navbars/Sidebar";
import Topbar from "../../components/navbars/Topbar";
import Chart from "../../components/charts/Chart";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "@firebase/firestore";
import { db } from "../../config/firestore";
import { useEffect, useState } from "react";
import WeeklyChart from "../../components/charts/WeeklyChart";

const Dashboard = ({ title }) => {
  const [isActiveDorm, setIsActiveDorm] = useState(false);
  const [isActiveCCS, setIsActiveCCS] = useState(false);

  const [selectedWeek, setSelectedWeek] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [CCSRightData, setCCSRightData] = useState({});
  const [CCSLeftData, setCCSLeftData] = useState({});
  const [DormRightData, setDormRightData] = useState({});
  const [DormLeftData, setDormLeftData] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");

  const [usageCCSRight, setUsageCCSRight] = useState([]);
  const [usageCCSLeft, setUsageCCSLeft] = useState([]);
  const [usageDormLeft, setUsageDormLeft] = useState([]);
  const [usageDormRight, setUsageDormRight] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "CCS"),
        where("location", "==", "CCSRight"),
        orderBy("DateTime", "desc"),
        limit(5)
      ),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setUsageCCSRight(data);
        console.log("CCS Right Data:", data);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "CCS"),
        where("location", "==", "CCSLeft"),
        orderBy("DateTime", "desc"),
        limit(5)
      ),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setUsageCCSLeft(data);
        console.log("CCS Left Data:", data);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Dorm"),
        where("location", "==", "DormLeft"),
        orderBy("DateTime", "desc"),
        limit(5)
      ),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setUsageDormLeft(data);
        console.log("Dorm Left Data:", data);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Dorm"),
        where("location", "==", "DormRight"),
        orderBy("DateTime", "desc"),
        limit(5)
      ),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setUsageDormRight(data);
        console.log("Dorm Right Data:", data);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ============================= Functions for total chart
  useEffect(() => {
    const currentDate = new Date();
    const currentWeekNumber = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();
    const formattedCurrentWeek = `${currentYear}-W${currentWeekNumber
      .toString()
      .padStart(2, "0")}`;
    setSelectedWeek(formattedCurrentWeek);

    // Calculate and log the date range if selectedWeek has a value
    if (formattedCurrentWeek) {
      const [year, weekNumber] = formattedCurrentWeek.split("-W");
      const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
      const endDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 + 6);
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
      const formattedStartDate = startDate.toISOString().substring(0, 10);
      const formattedEndDate = endDate.toISOString().substring(0, 10);

      // Update the date range state variables
      setDateRange({ start: formattedStartDate, end: formattedEndDate });

      console.log(`Date Range: ${formattedStartDate} - ${formattedEndDate}`);
    }
    console.log("Initial Selected Week:", formattedCurrentWeek);
  }, []);

  // const handleWeekChange = (event) => {
  //   // Ensure event object exists and contains the target property
  //   if (event && event.target && event.target.value) {
  //     let weekValue = event.target.value;
  //     if (!weekValue) {
  //       const currentDate = new Date();
  //       const currentWeekNumber = getWeekNumber(currentDate);
  //       const currentYear = currentDate.getFullYear();
  //       weekValue = `${currentYear}-W${currentWeekNumber
  //         .toString()
  //         .padStart(2, "0")}`;
  //     }
  //     setSelectedWeek(weekValue);
  //     handleWeekChange(weekValue, setDateRange);
  //     console.log(`Selected Week (CCS): ${weekValue}`);
  //   }
  // };

  const handleWeekChange = (event) => {
    const weekValue = event.target.value; // Directly get the value from the event
    setSelectedWeek(weekValue); // Update the selected week state

    // Early return if weekValue is not provided
    if (!weekValue) return;

    const [year, weekNumber] = weekValue.split("-W");
    const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const endDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 + 6);

    // This depends on how you want your week to start (Sunday or Monday)
    // startDate.setDate(startDate.getDate() + (startDate.getDay() === 0 ? 1 : 0));
    // endDate.setDate(endDate.getDate() + (endDate.getDay() === 0 ? 1 : 0));

    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);

    const formattedStartDate = startDate.toISOString().substring(0, 10);
    const formattedEndDate = endDate.toISOString().substring(0, 10);

    setDateRange({ start: formattedStartDate, end: formattedEndDate }); // Update the date range state
  };

  useEffect(() => {
    // Format date
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const formattedStartDate = startDate.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const formattedEndDate = endDate.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setFormattedStartDate(formattedStartDate);
      setFormattedEndDate(formattedEndDate);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData(
      selectedWeek,
      dateRange,
      setDormRightData,
      setDormLeftData,
      "Dorm"
    );
    fetchData(selectedWeek, dateRange, setCCSRightData, setCCSLeftData, "CCS");

    const fetchDataInterval = setInterval(() => {
      fetchData(
        selectedWeek,
        dateRange,
        setDormRightData,
        setDormLeftData,
        "Dorm"
      );
      fetchData(
        selectedWeek,
        dateRange,
        setCCSRightData,
        setCCSLeftData,
        "CCS"
      );
    }, 3600000);

    return () => clearInterval(fetchDataInterval);
  }, [selectedWeek, dateRange]);

  const fetchData = async (
    selectedWeek,
    dateRange,
    setRightData,
    setLeftData,
    locationType
  ) => {
    try {
      setIsLoading(true);

      if (selectedWeek && dateRange.start && dateRange.end) {
        const [year, weekNumber] = selectedWeek.split("-W");
        const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
        const endDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 + 6);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        const formattedStartDate = startDate.toISOString().substring(0, 10);
        const formattedEndDate = endDate.toISOString().substring(0, 10);

        const startISO = new Date(dateRange.start);
        const endISO = new Date(dateRange.end);

        const rightLocation = locationType + "Right";
        const leftLocation = locationType + "Left";

        await fetchDataForLocation(
          rightLocation,
          startISO,
          endISO,
          locationType,
          setRightData
        );
        await fetchDataForLocation(
          leftLocation,
          startISO,
          endISO,
          locationType,
          setLeftData
        );
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataForLocation = async (
    location,
    startDate,
    endDate,
    database,
    setData
  ) => {
    try {
      const data = [];
      const currentDate = new Date(startDate);

      console.log(`Fetching ${location} data from Firestore...`);

      while (currentDate <= endDate) {
        const querySnapshot = await getDocs(
          query(
            collection(db, database),
            where("location", "==", location),
            where("DateTime", ">=", currentDate),
            where("DateTime", "<=", new Date(currentDate.getTime() + 86400000)), // Adding 24 hours to the current date
            orderBy("DateTime", "desc"),
            limit(1)
          )
        );

        const dailyData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formattedDate =
          currentDate.getFullYear() +
          "-" +
          ("0" + (currentDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + currentDate.getDate()).slice(-2);

        console.log(`${location} Data for ${formattedDate}:`, dailyData);
        data.push({ date: formattedDate, entries: dailyData });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setData(data);
    } catch (error) {
      console.error(`Error fetching ${location} data: `, error);
    }
  };

  const getWeekNumber = (date) => {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 4);
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  };

  return (
    <div>
      <Sidebar />
      <section id="content" className="content">
        <Topbar />
        <main>
          <h1 className="title">{title}</h1>
          <ul className="breadcrumbs">
            <li>
              <Link to="#" className="a">
                Home
              </Link>
            </li>
            <li className="divider">/</li>
            <li>
              <Link to="#" className="a active">
                Dashboard
              </Link>
            </li>
          </ul>

          {/* insert chart components */}
          <div className="data-viz">
            {/* colors */}
            <div className="content-card">
              <Chart
                data={usageCCSLeft}
                // colors="#1b998b"
                // colors="#2D4B8A"
                location="Left"
                building="CCS"
                type="line"
                header="Realtime Reading"
                height={350}
              />
            </div>
            <div className="content-card">
              <Chart
                data={usageCCSRight}
                // colors="#2D4B8A"
                location="Right"
                building="CCS"
                type="line"
                header="Realtime Reading"
                height={350}
              />
            </div>
            <div className="content-card">
              <Chart
                data={usageDormLeft}
                // colors="#7b2cbf"
                // colors="#3C63C6"
                location="Left"
                building="Dorm"
                type="line"
                header="Realtime Reading"
                height={350}
              />
            </div>
            <div className="content-card">
              <Chart
                data={usageDormRight}
                // colors="#3C63C6"
                location="Right"
                building="Dorm"
                type="line"
                header="Realtime Reading"
                height={350}
              />
            </div>
          </div>
          {/* by building */}

          {/* total */}
          <div className="input-section2">
            <div className="form-card">
              <form action="POST">
                <input
                  type="week"
                  id="weekCCS"
                  name="weekCCS"
                  value={selectedWeek}
                  onChange={handleWeekChange}
                />

                {isLoading && <p className="loading">Loading data...</p>}
              </form>
            </div>
            <div className="chart-container">
              <div className="chart-content" id="chart">
                <div className="head">
                  <p className="header">Last 7 days</p>
                  <p className="building">Total Water Consumption</p>
                  <p className="reminder">
                    <i className="bx bx-chevron-left icon-left"></i>
                    <span>{`${formattedStartDate} - ${formattedEndDate}`}</span>
                    <i className="bx bx-chevron-right icon-right"></i>
                  </p>
                </div>
                <WeeklyChart
                  height={400}
                  type="bar"
                  // dateRange={dateRange}
                  rightCCSTotal={CCSRightData}
                  leftCCSTotal={CCSLeftData}
                  rightDormTotal={DormRightData}
                  leftDormTotal={DormLeftData}
                  tankLocation="Total"
                />
              </div>
            </div>
          </div>
          {/* total */}
        </main>
      </section>
    </div>
  );
};

export default Dashboard;

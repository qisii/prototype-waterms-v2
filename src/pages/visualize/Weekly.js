import React, { useEffect, useState } from "react";
import Sidebar from "../../components/navbars/Sidebar";
import Topbar from "../../components/navbars/Topbar";
import Chart from "../../components/charts/Chart";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "../../config/firestore";
// import { useDataContext } from "../../contexts/DataContextProvider";
import WeeklyChart from "../../components/charts/WeeklyChart";

const Weekly = ({ title }) => {
  const [isActiveDorm, setIsActiveDorm] = useState(false);
  const [isActiveCCS, setIsActiveCCS] = useState(false);
  const [selectedOptionDorm, setSelectedOptionDorm] = useState(
    "Select Tank Location"
  );
  const [selectedOptionCCS, setSelectedOptionCCS] = useState(
    "Select Tank Location"
  );

  const [selectedTankDorm, setSelectedTankDorm] = useState("");
  const [selectedTankCCS, setSelectedTankCCS] = useState("");

  // const [selectedWeek, setSelectedWeek] = useState("");
  // const [dateRange, setDateRange] = useState({ start: null, end: null });

  const [selectedWeekDorm, setSelectedWeekDorm] = useState("");
  const [selectedWeekCCS, setSelectedWeekCCS] = useState("");
  const [dateRangeDorm, setDateRangeDorm] = useState({ start: "", end: "" });
  const [dateRangeCCS, setDateRangeCCS] = useState({ start: "", end: "" });

  const [CCSRightData, setCCSRightData] = useState({});
  const [CCSLeftData, setCCSLeftData] = useState({});
  const [DormRightData, setDormRightData] = useState({});
  const [DormLeftData, setDormLeftData] = useState({});

  const [isLoadingDorm, setIsLoadingDorm] = useState(false);
  const [isLoadingCCS, setIsLoadingCCS] = useState(false);

  const [formattedStartDateDorm, setFormattedStartDateDorm] = useState("");
  const [formattedEndDateDorm, setFormattedEndDateDorm] = useState("");
  const [formattedStartDateCCS, setFormattedStartDateCCS] = useState("");
  const [formattedEndDateCCS, setFormattedEndDateCCS] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const currentWeekNumber = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();
    const formattedCurrentWeek = `${currentYear}-W${currentWeekNumber
      .toString()
      .padStart(2, "0")}`;
    setSelectedWeekDorm(formattedCurrentWeek);
    setSelectedWeekCCS(formattedCurrentWeek);

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
      setDateRangeDorm({ start: formattedStartDate, end: formattedEndDate });
      setDateRangeCCS({ start: formattedStartDate, end: formattedEndDate });

      console.log(`Date Range: ${formattedStartDate} - ${formattedEndDate}`);
    }
    console.log("Initial Selected Week:", formattedCurrentWeek);
  }, []);

  const toggleOptionsDorm = () => {
    setIsActiveDorm(!isActiveDorm);
    setIsActiveCCS(false);
  };

  const toggleOptionsCCS = () => {
    setIsActiveCCS(!isActiveCCS);
    setIsActiveDorm(false);
  };

  const handleOptionClickDorm = (value, optionText) => {
    setSelectedOptionDorm(optionText);
    setSelectedTankDorm(value);
    console.log(value);
  };

  const handleOptionClickCCS = (value, optionText) => {
    setSelectedOptionCCS(optionText);
    setSelectedTankCCS(value);
    console.log(value);
  };

  const handleWeekChangeDorm = (event) => {
    let weekValue = event.target.value;
    if (!weekValue) {
      const currentDate = new Date();
      const currentWeekNumber = getWeekNumber(currentDate);
      const currentYear = currentDate.getFullYear();
      weekValue = `${currentYear}-W${currentWeekNumber
        .toString()
        .padStart(2, "0")}`;
    }
    setSelectedWeekDorm(weekValue);
    handleWeekChange(weekValue, setDateRangeDorm);
    console.log(`Selected Week (Dorm): ${weekValue}`);
  };

  const handleWeekChangeCCS = (event) => {
    let weekValue = event.target.value;
    if (!weekValue) {
      const currentDate = new Date();
      const currentWeekNumber = getWeekNumber(currentDate);
      const currentYear = currentDate.getFullYear();
      weekValue = `${currentYear}-W${currentWeekNumber
        .toString()
        .padStart(2, "0")}`;
    }
    setSelectedWeekCCS(weekValue);
    handleWeekChange(weekValue, setDateRangeCCS);
    console.log(`Selected Week (CCS): ${weekValue}`);
  };

  const handleWeekChange = (weekValue, setDateRange) => {
    if (weekValue) {
      const [year, weekNumber] = weekValue.split("-W");
      const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
      const endDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 + 6);
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
      const formattedStartDate = startDate.toISOString().substring(0, 10);
      const formattedEndDate = endDate.toISOString().substring(0, 10);
      setDateRange({ start: formattedStartDate, end: formattedEndDate });
      console.log(`Date Range: ${formattedStartDate} - ${formattedEndDate}`);
    } else {
      setDateRange({ start: null, end: null });
    }
  };

  useEffect(() => {
    fetchData(
      selectedWeekDorm,
      dateRangeDorm,
      setDormRightData,
      setDormLeftData,
      "Dorm",
      selectedTankDorm
    );
  }, [selectedWeekDorm, dateRangeDorm, selectedTankDorm]);

  useEffect(() => {
    fetchData(
      selectedWeekCCS,
      dateRangeCCS,
      setCCSRightData,
      setCCSLeftData,
      "CCS",
      selectedTankCCS
    );
  }, [selectedWeekCCS, dateRangeCCS, selectedTankCCS]);

  const fetchData = async (
    selectedWeek,
    setDateRange,
    setRightData,
    setLeftData,
    locationType,
    selectedTank
  ) => {
    let isLoading =
      locationType === "Dorm" ? setIsLoadingDorm : setIsLoadingCCS;

    try {
      isLoading(true);

      if (selectedWeek && setDateRange.start && setDateRange.end) {
        const [year, weekNumber] = selectedWeek.split("-W");
        const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
        const endDate = new Date(year, 0, 1 + (weekNumber - 1) * 7 + 6);
        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);

        const formattedStartDate = startDate.toISOString().substring(0, 10);
        const formattedEndDate = endDate.toISOString().substring(0, 10);

        const startISO = new Date(setDateRange.start);
        console.log("Start Date - iso:", startISO);

        const endISO = new Date(setDateRange.end);
        console.log("End Date - iso:", endISO);

        const rightLocation = locationType + "Right";
        const leftLocation = locationType + "Left";

        await fetchDataForLocation(
          rightLocation,
          startISO,
          endISO,
          locationType,
          setRightData,
          selectedTank
        );
        await fetchDataForLocation(
          leftLocation,
          startISO,
          endISO,
          locationType,
          setLeftData,
          selectedTank
        );
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      isLoading(false);
    }
  };

  const fetchDataForLocation = async (
    location,
    startDate,
    endDate,
    database,
    setData,
    selectedTank
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

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setData(data);
    } catch (error) {
      console.error(`Error fetching ${location} data: `, error);
    }
  };

  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      fetchData(
        selectedWeekDorm,
        dateRangeDorm,
        setDormRightData,
        setDormLeftData,
        "Dorm",
        selectedTankDorm
      );
      fetchData(
        selectedWeekCCS,
        dateRangeCCS,
        setCCSRightData,
        setCCSLeftData,
        "CCS",
        selectedTankCCS
      );
    }, 3600000);

    // Cleanup function to clear the interval when the component unmounts or when the dependencies change
    return () => clearInterval(fetchDataInterval);
  }, [
    selectedWeekDorm,
    dateRangeDorm,
    selectedTankDorm,
    selectedTankCCS,
    selectedWeekCCS,
    dateRangeCCS,
  ]);

  const getWeekNumber = (date) => {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 4);
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  };

  useEffect(() => {
    // Format date for Dorm
    if (dateRangeDorm.start && dateRangeDorm.end) {
      const startDateDorm = new Date(dateRangeDorm.start);
      const endDateDorm = new Date(dateRangeDorm.end);
      const formattedStartDateDorm = startDateDorm.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const formattedEndDateDorm = endDateDorm.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setFormattedStartDateDorm(formattedStartDateDorm);
      setFormattedEndDateDorm(formattedEndDateDorm);
    }

    // Format date for CCS
    if (dateRangeCCS.start && dateRangeCCS.end) {
      const startDateCCS = new Date(dateRangeCCS.start);
      const endDateCCS = new Date(dateRangeCCS.end);
      const formattedStartDateCCS = startDateCCS.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const formattedEndDateCCS = endDateCCS.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setFormattedStartDateCCS(formattedStartDateCCS);
      setFormattedEndDateCCS(formattedEndDateCCS);
    }
  }, [dateRangeDorm, dateRangeCCS]);

  return (
    <div>
      <Sidebar />
      <section id="content" className="content">
        <Topbar />
        <main>
          <h1 className="title">{title}</h1>

          {/* Building 1 */}
          <div className="input-section1">
            <div className="form-card">
              <form action="POST">
                <input
                  type="week"
                  id="weekDorm"
                  name="weekDorm"
                  value={selectedWeekDorm}
                  onChange={handleWeekChangeDorm}
                />

                <div className="select-menu" onClick={toggleOptionsDorm}>
                  <div className="select-btn" tabIndex="0">
                    <span className="select-text">{selectedOptionDorm}</span>
                    <i className="bx bx-chevron-down"></i>
                  </div>
                  <ul className={`options ${isActiveDorm ? "active" : ""}`}>
                    <li
                      className="option"
                      onClick={() =>
                        handleOptionClickDorm("", "Select Tank Location")
                      }
                    >
                      <span className="option-text">Select Tank Location</span>
                    </li>
                    <li
                      className="option"
                      onClick={() =>
                        handleOptionClickDorm("DormRight", "Right Tank")
                      }
                    >
                      <span className="option-text">Right Tank</span>
                    </li>
                    <li
                      className="option"
                      onClick={() =>
                        handleOptionClickDorm("DormLeft", "Left Tank")
                      }
                    >
                      <span className="option-text">Left Tank</span>
                    </li>
                  </ul>
                </div>
                {isLoadingDorm && <p className="loading">Loading data...</p>}
              </form>
            </div>
            <div className="chart-container">
              <div className="chart-content" id="chart">
                <div className="head">
                  <p className="header">Last 7 days</p>
                  <p className="building">Alumni Dormitory</p>
                  <p className="reminder">
                    <i className="bx bx-chevron-left icon-left"></i>
                    <span>{`${formattedStartDateDorm} - ${formattedEndDateDorm}`}</span>
                    <i className="bx bx-chevron-right icon-right"></i>
                  </p>
                </div>
                <WeeklyChart
                  height={400}
                  type="bar"
                  // dateRange={dateRangeDorm}
                  right={DormRightData}
                  left={DormLeftData}
                  tankLocation={selectedTankDorm}
                />
              </div>
            </div>
            {/* Display DormRightData and DormLeftData as lists
            <div>
              <h2>Dorm Right Data</h2>
              <ul>
                {DormRightData.map((entry, index) => (
                  <li key={index}>{JSON.stringify(entry)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Dorm Left Data</h2>
              <ul>
                {DormLeftData.map((entry, index) => (
                  <li key={index}>{JSON.stringify(entry)}</li>
                ))}
              </ul>
            </div> */}
          </div>

          {/* Building 2 */}
          <div className="input-section2">
            <div className="form-card">
              <form action="POST">
                <input
                  type="week"
                  id="weekCCS"
                  name="weekCCS"
                  value={selectedWeekCCS}
                  onChange={handleWeekChangeCCS}
                />

                <div className="select-menu" onClick={toggleOptionsCCS}>
                  <div className="select-btn" tabIndex="0">
                    <span className="select-text">{selectedOptionCCS}</span>
                    <i className="bx bx-chevron-down"></i>
                  </div>
                  <ul className={`options ${isActiveCCS ? "active" : ""}`}>
                    <li
                      className="option"
                      onClick={() =>
                        handleOptionClickCCS("", "Select Tank Location")
                      }
                    >
                      <span className="option-text">Select Tank Location</span>
                    </li>
                    <li
                      className="option"
                      onClick={() =>
                        handleOptionClickCCS("CCSRight", "Right Tank")
                      }
                    >
                      <span className="option-text">Right Tank</span>
                    </li>
                    <li
                      className="option"
                      onClick={() =>
                        handleOptionClickCCS("CCSLeft", "Left Tank")
                      }
                    >
                      <span className="option-text">Left Tank</span>
                    </li>
                  </ul>
                </div>

                {isLoadingCCS && <p className="loading">Loading data...</p>}
              </form>
            </div>
            <div className="chart-container">
              <div className="chart-content" id="chart">
                <div className="head">
                  <p className="header">Last 7 days</p>
                  <p className="building">College of Computer Studies</p>
                  <p className="reminder">
                    <i className="bx bx-chevron-left icon-left"></i>
                    <span>{`${formattedStartDateCCS} - ${formattedEndDateCCS}`}</span>
                    <i className="bx bx-chevron-right icon-right"></i>
                  </p>
                </div>
                <WeeklyChart
                  height={400}
                  type="bar"
                  // dateRange={dateRangeCCS}
                  right={CCSRightData}
                  left={CCSLeftData}
                  tankLocation={selectedTankCCS}
                />
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Weekly;

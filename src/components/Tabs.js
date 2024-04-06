import React, { useEffect, useState } from "react";
import Sidebar from "./navbars/Sidebar";
import WeeklyChart from "./charts/WeeklyChart";
import HourlyChart from "./charts/HourlyChart";
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  onSnapshot,
} from "@firebase/firestore";
import { format } from "date-fns";
import { db } from "../config/firestore";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("dorm");

  // const [selectedDate, setSelectedDate] = useState("");
  const [specificDate, setSpecificDate] = useState("");

  const [selectedDateDorm, setSelectedDateDorm] = useState("");
  const [selectedDateCCS, setSelectedDateCCS] = useState("");

  const [CCSRightData, setCCSRightData] = useState({});
  const [CCSLeftData, setCCSLeftData] = useState({});
  const [DormRightData, setDormRightData] = useState({});
  const [DormLeftData, setDormLeftData] = useState({});

  // useEffect(() => {
  //   if (selectedDateDorm || selectedDateCCS) {
  //     const dateValue = selectedDateDorm || selectedDateCCS;
  //     const date = new Date(dateValue);
  //     // date.setHours(date.getHours() + 8); // Convert to UTC+8
  //     // const specificDate = date.toISOString();
  //     setSpecificDate(date);
  //     fetchData(specificDate);
  //   }
  // }, [selectedDateDorm, selectedDateCCS]);

  useEffect(() => {
    if (
      (selectedDateDorm && activeTab === "dorm") ||
      (selectedDateCCS && activeTab === "ccs")
    ) {
      const dateValue =
        activeTab === "dorm" ? selectedDateDorm : selectedDateCCS;
      const date = new Date(dateValue);
      setSpecificDate(date);
      fetchData(date);
    }
  }, [selectedDateDorm, selectedDateCCS, activeTab]);

  const handleDateChange = (event) => {
    const dateValue = event.target.value;

    if (activeTab === "dorm") {
      if (!dateValue) {
        // If dateValue is empty, return "none"
        setSelectedDateDorm("");
        setDormLeftData({});
        setDormRightData({});
      } else {
        setSelectedDateDorm(dateValue);
        console.log(`Selected Date: ${dateValue}`);
        // Convert selected date to UTC+8
        const date = new Date(dateValue);
        // date.setHours(date.getHours() + 8); // Convert to UTC+8
        const specificDate = date.toISOString();
        setSpecificDate(specificDate);
      }
    } else if (activeTab === "ccs") {
      if (!dateValue) {
        // If dateValue is empty, return "none"
        setSelectedDateCCS("");
        setCCSLeftData({});
        setCCSRightData({});
      } else {
        setSelectedDateCCS(dateValue);
        console.log(`Selected Date: ${dateValue}`);
        // Convert selected date to UTC+8
        const date = new Date(dateValue);
        // date.setHours(date.getHours() + 8); // Convert to UTC+8
        const specificDate = date.toISOString();
        setSpecificDate(specificDate);
      }
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // storing if data does not exists
  const fetchData = async (specificDate) => {
    try {
      // Construct the start and end date for querying Firestore
      const start = new Date(specificDate);
      // start.setHours(start.getHours() - 8);
      const end = new Date(specificDate);
      end.setDate(end.getDate() + 1); // Add 1 day
      // end.setHours(end.getHours() - 8);
      console.log("Start : ", start);
      console.log("End : ", end);

      if (activeTab === "dorm") {
        await fetchDataForLocation(
          "DormRight",
          start,
          end,
          "Dorm",
          setDormRightData
        );
        await fetchDataForLocation(
          "DormLeft",
          start,
          end,
          "Dorm",
          setDormLeftData
        );
      } else if (activeTab === "ccs") {
        await fetchDataForLocation(
          "CCSRight",
          start,
          end,
          "CCS",
          setCCSRightData
        );
        await fetchDataForLocation(
          "CCSLeft",
          start,
          end,
          "CCS",
          setCCSLeftData
        );
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchDataForLocation = async (
    location,
    start,
    end,
    database,
    setData
  ) => {
    try {
      console.log(`Fetching ${location} data from Firestore...`);

      // Clear the existing data state
      setData({});

      // Loop for the current day (midnight to 11:00 PM)
      for (let hour = 8; hour < 24; hour++) {
        const hourStart = new Date(start);
        hourStart.setHours(hour);
        const hourEnd = new Date(start);
        hourEnd.setHours(hour + 1);

        const unsubscribe = onSnapshot(
          query(
            collection(db, database),
            where("location", "==", location),
            where("DateTime", ">=", hourStart),
            where("DateTime", "<", hourEnd),
            orderBy("DateTime", "desc"),
            limit(1)
          ),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log(
              `Hour Range : ${hourStart.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                hour12: true,
              })}-${hourEnd.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true,
              })}`
            );
            console.log(`${location} Data:`, data);

            // Update the corresponding state variable based on the hour
            setData((prevState) => ({
              ...prevState,
              [`${hourStart}-${hourEnd}`]: data,
            }));
          },
          (error) => {
            console.error(`Error fetching ${location} data: `, error);
          }
        );
      }

      // Loop for the next day until 8:00 AM
      const nextDayStart = new Date(start);
      nextDayStart.setDate(nextDayStart.getDate() + 1); // Move to the next day
      for (let hour = 0; hour < 8; hour++) {
        const hourStart = new Date(nextDayStart);
        hourStart.setHours(hour);
        const hourEnd = new Date(nextDayStart);
        hourEnd.setHours(hour + 1);

        const unsubscribe = onSnapshot(
          query(
            collection(db, database),
            where("location", "==", location),
            where("DateTime", ">=", hourStart),
            where("DateTime", "<", hourEnd),
            orderBy("DateTime", "desc"),
            limit(1)
          ),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log(
              `Hour Range : ${hourStart.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                hour12: true,
              })}-${hourEnd.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true,
              })}`
            );
            console.log(`${location} Data:`, data);

            setData((prevState) => ({
              ...prevState,
              [`${hourStart}-${hourEnd}`]: data,
            }));
          },
          (error) => {
            console.error(`Error fetching ${location} data: `, error);
          }
        );
      }
    } catch (error) {
      console.error(`Error fetching ${location} data: `, error);
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-box">
        {/* Dormitory Tab */}
        <button
          className={`tab-btn ${activeTab === "dorm" ? "active" : ""}`}
          onClick={() => handleTabClick("dorm")}
        >
          Alumni Dormitory
        </button>

        {/* College of Computer Studies Tab */}
        <button
          className={`tab-btn ${activeTab === "ccs" ? "active" : ""}`}
          onClick={() => handleTabClick("ccs")}
        >
          College of Computer Studies
        </button>
      </div>

      {/* Content */}
      <div className="tab-content-box">
        {/* Building 1 - Alumni Dormitory */}
        <div className={`tab-content ${activeTab === "dorm" ? "active" : ""}`}>
          <div className="input-section">
            <div className="form-card">
              <form action="POST">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={selectedDateDorm}
                  onChange={handleDateChange}
                />
              </form>
            </div>
          </div>

          {/* Render either chart or message based on date selection */}
          {selectedDateDorm ? (
            <div className="tab-chart-container">
              <div className="tab-chart" id="chart">
                <div className="head">
                  <p className="header">Last 24 hours</p>
                  <p className="reminder">
                    Please be advised that data collection for the selected date
                    begins at 8AM and concludes at 8AM the following day.
                  </p>
                </div>
                <HourlyChart
                  height={450}
                  building="Alumni Dormitory"
                  type="line"
                  right={DormRightData}
                  left={DormLeftData}
                />
              </div>
            </div>
          ) : (
            <div className="message">
              <i className="bx bx-error-circle"></i>
              <span>Please select a date</span>
            </div>
          )}
        </div>

        {/* Building 2 - College of Computer Studies */}
        <div className={`tab-content ${activeTab === "ccs" ? "active" : ""}`}>
          <div className="input-section">
            <div className="form-card">
              <form action="POST">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={selectedDateCCS}
                  onChange={handleDateChange}
                />
              </form>
            </div>
          </div>

          {/* Render either chart or message based on date selection */}
          {selectedDateCCS ? (
            <div className="tab-chart-container">
              <div className="tab-chart" id="chart">
                <div className="head">
                  <p className="header">Last 24 hours</p>
                  <p className="reminder">
                    Please be advised that data collection for the selected date
                    begins at 8AM and concludes at 8AM the following day.
                  </p>
                </div>
                <HourlyChart
                  height={450}
                  building="College of Computer Studies"
                  type="line"
                  right={CCSRightData}
                  left={CCSLeftData}
                />
              </div>
            </div>
          ) : (
            <div className="message">
              <i className="bx bx-error-circle"></i>
              <span>Please select a date</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firestore";

// Create a context for the data
const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

const DataContextProvider = ({ children }) => {
  const [ccsData, setCCSData] = useState([]);
  const [dormData, setDormData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  //   const convertAndStoreDateTime = (dataKey, data) => {
  //     try {
  //       if (data && data.length > 0) {
  //         const convertedData = data.map((item) => {
  //           if (item.DateTime && item.DateTime.seconds) {
  //             item.DateTime = new Date(item.DateTime.seconds * 1000);
  //           }
  //           return item;
  //         });
  //         localStorage.setItem(dataKey, JSON.stringify(convertedData));
  //       }
  //     } catch (error) {
  //       console.error("Error converting and storing datetime: ", error);
  //     }
  //   };

  const fetchData = async () => {
    // try {
    //   // CCS Data Check
    //   let storedCCSData = localStorage.getItem("fetchedCCSData");
    //   if (!storedCCSData || storedCCSData.length === 0) {
    //     console.log("Fetching CCS data from Firestore...");
    //     const unsubscribeCCS = onSnapshot(
    //       query(collection(db, "CCS"), orderBy("DateTime", "desc"), limit(5)),
    //       (snapshot) => {
    //         const ccsData = snapshot.docs.map((doc) => doc.data());
    //         // convertAndStoreDateTime("fetchedCCSData", ccsData);
    //         localStorage.setItem("fetchedCCSData", JSON.stringify(ccsData));
    //       },
    //       (error) => {
    //         console.error("Error fetching CCS data: ", error);
    //       }
    //     );
    //     return () => unsubscribeCCS();
    //   } else {
    //     console.log("CCS data already exists in local storage.");
    //   }
    //   // Dorm Data Check
    //   let storedDormData = localStorage.getItem("fetchedDormData");
    //   if (!storedDormData || JSON.parse(storedDormData).length === 0) {
    //     console.log("Fetching Dorm data from Firestore...");
    //     const unsubscribeDorm = onSnapshot(
    //       query(collection(db, "Dorm"), orderBy("DateTime", "desc"), limit(5)),
    //       (snapshot) => {
    //         const dormData = snapshot.docs.map((doc) => doc.data());
    //         // convertAndStoreDateTime("fetchedDormData", dormData);
    //         localStorage.setItem("fetchedDormData", JSON.stringify(dormData));
    //       },
    //       (error) => {
    //         console.error("Error fetching Dorm data: ", error);
    //       }
    //     );
    //     return () => unsubscribeDorm();
    //   } else {
    //     console.log("Dorm data already exists in local storage.");
    //   }
    // } catch (error) {
    //   console.error("Error fetching data: ", error);
    // }
  };

  return (
    <DataContext.Provider value={{ ccsData, dormData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

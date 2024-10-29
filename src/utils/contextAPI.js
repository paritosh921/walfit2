import React, { createContext, useContext, useState, ReactNode } from "react";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const INITIAL_DATA = [
    {
      id: "1",
      date: "23 July 2024",
      time: "07:30 AM",
      image: "https://via.placeholder.com/150",
      calories: "50",
      fat: "50",
      protein: "10",
    },
  ];
//   var initialState;
//   var sidebarInitialState;
//   if (typeof window !== "undefined") {
//     initialState = localStorage.getItem("state");
//     sidebarInitialState = localStorage.getItem("sidebarOpen");
//   }
  const [data, setData] = useState(INITIAL_DATA);
  const [decimals, setDecimals] = useState([]);

  return (
    <AppContext.Provider
      value={{
        // openUploadModal,
        // setOpenUploadModal,
        data,
        setData,
        decimals,
        setDecimals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
}

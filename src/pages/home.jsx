import { useState, useEffect } from "react";

import Weather from "../components/Weather";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [favourites, setFavourites] = useState([
    { id: 1, text: "", country: "", value: 0 },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const [unit, setUnit] = useState("metric");
  const [mode, setMode] = useState("Day");
  const [time, setTime] = useState("24H");

  const [coords, setCoords] = useState({ lat: "", lon: "" });

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const switchUnit = () => {
    if (unit === "imperial") {
      setUnit("metric");
      localStorage.setItem("Units", "metric");
    } else {
      setUnit("imperial");
      localStorage.setItem("Units", "imperial");
    }
  };

  const switchMode = () => {
    if (mode === "Day") {
      setMode("Night");
      localStorage.setItem("Mode", "Night");
    } else {
      setMode("Day");
      localStorage.setItem("Mode", "Day");
    }
  };

  const switchTime = () => {
    if (time === "24H") {
      setTime("12H");
      localStorage.setItem("Time", "12H");
    } else {
      setTime("24H");
      localStorage.setItem("Time", "24H");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("Favourites") === null) {
      const cities = [
        {
          id: 1,
          text: "Johannesburg",
          country: "South Africa",
          value: "-26.204361111 28.041638888",
        },
      ];
      localStorage.setItem("Favourites", JSON.stringify(cities));
      localStorage.setItem("Mode", "Day");
      localStorage.setItem("Units", "metric");
      localStorage.setItem("Time", "24H");
      setFavourites(JSON.parse(localStorage.getItem("Favourites")));
    } else {
      setFavourites(JSON.parse(localStorage.getItem("Favourites")));
    }

    const [latitude, longitude] = JSON.parse(
      localStorage.getItem("Favourites")
    )[0].value.split(" ");
    setCoords({ lat: latitude, lon: longitude });

    if (localStorage.getItem("Units") === "metric") {
      setUnit("metric");
    } else {
      setUnit("imperial");
    }

    if (localStorage.getItem("Mode") === "Day") {
      setMode("Day");
    } else {
      setMode("Night");
    }

    if (localStorage.getItem("Time") === "24H") {
      setTime("24H");
    } else {
      setTime("12H");
    }

    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1080) {
        setIsOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (favourites[0].value != 0) {
      localStorage.setItem("Favourites", JSON.stringify(favourites));
    }
  }, [favourites]);

  return (
    <div>
      <Sidebar
        isOpen={isOpen}
        toggle={toggle}
        unitControl={{ unit: unit, switchUnit: switchUnit }}
        modeControl={{ mode: mode, switchMode: switchMode }}
        timeControl={{ time: time, switchTime: switchTime }}
        favourites={favourites}
        setCoords={setCoords}
      />
      <Weather
        toggle={toggle}
        unit={unit}
        favourites={favourites}
        setFavourites={setFavourites}
        coords={coords}
        setCoords={setCoords}
        mode={mode}
        time={time}
      />
    </div>
  );
};
export default Home;

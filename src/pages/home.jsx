import { useState, useEffect } from "react";

import Weather from "../components/Weather";
import MobileSidebar from "../components/MobileSidebar";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [favourites, setFavourites] = useState([
    { id: 1, text: "", country: "", value: 0 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [mode, setMode] = useState("Day");
  const [time, setTime] = useState("24H");
  const [tempChecked, setTempChecked] = useState(false);
  const [modeChecked, setModeChecked] = useState(false);
  const [timeChecked, setTimeChecked] = useState(false);
  const [lon, setLon] = useState("28.041638888");
  const [lat, setLat] = useState("-26.204361111");

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

  const changeTemp = () => {
    setTempChecked(!tempChecked);
  };

  const changeMode = () => {
    setModeChecked(!modeChecked);
  };

  const changeTime = () => {
    setTimeChecked(!timeChecked);
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

    if (localStorage.getItem("Units") === "metric") {
      setUnit("metric");
      setTempChecked(false);
    } else {
      setUnit("imperial");
      setTempChecked(true);
    }

    if (localStorage.getItem("Mode") === "Day") {
      setMode("Day");
      setModeChecked(false);
    } else {
      setMode("Night");
      setModeChecked(true);
    }

    if (localStorage.getItem("Time") === "24H") {
      setTime("24H");
      setTimeChecked(false);
    } else {
      setTime("12H");
      setTimeChecked(true);
    }
  }, []);

  useEffect(() => {
    if (favourites[0].value != 0) {
      localStorage.setItem("Favourites", JSON.stringify(favourites));
    }
  }, [favourites]);

  return (
    <div>
      <MobileSidebar
        isOpen={isOpen}
        toggle={toggle}
        switchUnit={switchUnit}
        tempChecked={tempChecked}
        changeTemp={changeTemp}
        switchMode={switchMode}
        modeChecked={modeChecked}
        changeMode={changeMode}
        switchTime={switchTime}
        timeChecked={timeChecked}
        changeTime={changeTime}
        favourites={favourites}
        setLat={setLat}
        setLon={setLon}
      />
      <Sidebar
        switchUnit={switchUnit}
        tempChecked={tempChecked}
        changeTemp={changeTemp}
        switchMode={switchMode}
        modeChecked={modeChecked}
        changeMode={changeMode}
        switchTime={switchTime}
        timeChecked={timeChecked}
        changeTime={changeTime}
        favourites={favourites}
        setLat={setLat}
        setLon={setLon}
      />
      <Weather
        toggle={toggle}
        unit={unit}
        favourites={favourites}
        setFavourites={setFavourites}
        lon={lon}
        setLon={setLon}
        lat={lat}
        setLat={setLat}
        modeChecked={modeChecked}
        timeChecked={timeChecked}
      />
    </div>
  );
};
export default Home;

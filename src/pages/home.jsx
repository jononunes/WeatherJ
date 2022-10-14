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
  const [tempChecked, setTempChecked] = useState(false);
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

  const changeTemp = () => {
    setTempChecked(!tempChecked);
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
      localStorage.setItem("Time", "12H");
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
        favourites={favourites}
      />
      <Sidebar
        switchUnit={switchUnit}
        tempChecked={tempChecked}
        changeTemp={changeTemp}
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
      />
    </div>
  );
};
export default Home;

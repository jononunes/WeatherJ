import { useEffect, useState } from "react";
import { GoLocation, GoSettings } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import Image from "next/image";

import s from "../styles/sidebar.module.scss";

export default function Sidebar({
  switchUnit,
  tempChecked,
  changeTemp,
  switchMode,
  modeChecked,
  changeMode,
  switchTime,
  timeChecked,
  changeTime,
  favourites,
  setLat,
  setLon,
}) {
  const changeCity = (text) => {
    const index = favourites.findIndex((x) => x.text === text);
    const [latitude, longitude] = favourites[index].value.split(" ");
    setLat(latitude);
    setLon(longitude);
  };

  return (
    <div>
      <section
        className={`${s.sidebarSection} ${modeChecked && s.sectionNight}`}
      >
        <div className={s.top}>
          <div className={s.brand}>
            <Image
              src="/logo.png"
              alt="logo"
              width="100rem"
              height="50rem"
              objectFit="contain"
              className={s.logo}
            />
            <span className={s.logoText}>WeatherJ</span>
          </div>
          <div className={s.menu}></div>
          <div className={s.links}>
            <ul className={s.linksUl}>
              <div
                className={`${s.favouritesHeading} ${
                  modeChecked && s.headingNight
                }`}
              >
                <span>Favourite Locations</span>
                <FaRegStar />
              </div>
              {favourites.map((val, index) => (
                <li
                  key={index}
                  className={`${s.linksLi} ${modeChecked && s.headingNight}`}
                  onClick={() => changeCity(val.text)}
                >
                  <a href="#">
                    <GoLocation />
                    <span>{val.text}</span>
                  </a>
                </li>
              ))}
              <div
                className={`${s.preferencesHeading} ${
                  modeChecked && s.headingNight
                }`}
              >
                <span>Preferences</span>
                <GoSettings />
              </div>
              <div className={s.preferencesToggles}>
                <div
                  className={s.checkbox_toggle}
                  id={s.dn_cb}
                  onClick={switchMode}
                >
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={modeChecked}
                    onClick={changeMode}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${modeChecked && s.layerNight}`}
                  ></div>
                </div>

                <div
                  className={s.checkbox_toggle}
                  id={s.temp_cb}
                  onClick={switchUnit}
                >
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={tempChecked}
                    onClick={changeTemp}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${modeChecked && s.layerNight}`}
                  ></div>
                </div>

                <div
                  className={s.checkbox_toggle}
                  id={s.time_cb}
                  onClick={switchTime}
                >
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={timeChecked}
                    onClick={changeTime}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${modeChecked && s.layerNight}`}
                  ></div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

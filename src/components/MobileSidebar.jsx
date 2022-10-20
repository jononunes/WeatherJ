import { GoLocation, GoSettings } from "react-icons/go";
import { FaRegStar, FaTimes } from "react-icons/fa";
import Image from "next/image";

import s from "../styles/mobileSidebar.module.scss";

export default function MobileSidebar({
  isOpen,
  toggle,
  switchUnit,
  unit,
  switchMode,
  mode,
  switchTime,
  time,
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
      <aside
        className={`${s.sidebarSection} ${isOpen && s.sidebarOpen} ${
          mode === "Night" && s.sectionNight
        }`}
      >
        <div className={s.top}>
          <div className={s.brand}>
            <div className={s.title}>
              <Image
                src="/logo.png"
                alt="logo"
                width="150rem"
                height="100rem"
                objectFit="contain"
                className={s.logo}
              />
              <span className={s.logoText}>WeatherJ</span>
            </div>
            <div className={s.closeIconContainer} onClick={toggle}>
              <FaTimes size={50} className={s.closeIcon} />
            </div>
          </div>
          <div className={s.links}>
            <ul className={s.linksUl}>
              <div
                className={`${s.favouritesHeading} ${
                  mode === "Night" && s.headingNight
                }`}
              >
                <span>Favourite Locations</span>
                <FaRegStar />
              </div>
              {favourites.map((val, index) => (
                <li
                  key={index}
                  className={`${s.linksLi} ${
                    mode === "Night" && s.headingNight
                  }`}
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
                  mode === "Night" && s.headingNight
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
                    checked={mode === "Day" ? false : true}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${mode === "Night" && s.layerNight}`}
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
                    checked={unit === "metric" ? false : true}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${mode === "Night" && s.layerNight}`}
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
                    checked={time === "24H" ? false : true}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${mode === "Night" && s.layerNight}`}
                  ></div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

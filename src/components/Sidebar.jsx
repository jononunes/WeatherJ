import { GoLocation, GoSettings } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import Image from "next/image";

import s from "../styles/sidebar.module.scss";

export default function Sidebar({
  unitControl,
  modeControl,
  timeControl,
  favourites,
  setCoords,
}) {
  const changeCity = (id) => {
    const index = favourites.findIndex((x) => x.id === id);
    const [latitude, longitude] = favourites[index].value.split(" ");
    setCoords({ lat: latitude, lon: longitude });
  };

  return (
    <div>
      <section
        className={`${s.sidebarSection} ${
          modeControl.mode === "Night" && s.sectionNight
        }`}
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
                  modeControl.mode === "Night" && s.headingNight
                }`}
              >
                <span>Favourite Locations</span>
                <FaRegStar />
              </div>
              {favourites.map((val, index) => (
                <li
                  key={index}
                  className={`${s.linksLi} ${
                    modeControl.mode === "Night" && s.headingNight
                  }`}
                  onClick={() => changeCity(val.id)}
                >
                  <a>
                    <GoLocation />
                    <span>{val.text}</span>
                  </a>
                </li>
              ))}
              <div
                className={`${s.preferencesHeading} ${
                  modeControl.mode === "Night" && s.headingNight
                }`}
              >
                <span>Preferences</span>
                <GoSettings />
              </div>
              <div className={s.preferencesToggles}>
                <div
                  className={s.checkbox_toggle}
                  id={s.dn_cb}
                  onClick={modeControl.switchMode}
                >
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={modeControl.mode === "Day" ? false : true}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${
                      modeControl.mode === "Night" && s.layerNight
                    }`}
                  ></div>
                </div>

                <div
                  className={s.checkbox_toggle}
                  id={s.temp_cb}
                  onClick={unitControl.switchUnit}
                >
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={unitControl.unit === "metric" ? false : true}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${
                      modeControl.mode === "Night" && s.layerNight
                    }`}
                  ></div>
                </div>

                <div
                  className={s.checkbox_toggle}
                  id={s.time_cb}
                  onClick={timeControl.switchTime}
                >
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={timeControl.time === "24H" ? false : true}
                    readOnly
                  />
                  <div className={s.knobs}></div>
                  <div
                    className={`${s.layer} ${
                      modeControl.mode === "Night" && s.layerNight
                    }`}
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

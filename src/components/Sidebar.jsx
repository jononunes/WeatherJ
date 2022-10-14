import { useEffect, useState } from "react";
import { GoLocation, GoSettings } from "react-icons/go";
import { FaRegStar } from "react-icons/fa";
import Image from "next/image";

import s from "../styles/sidebar.module.scss";

export default function Sidebar({
  switchUnit,
  tempChecked,
  changeTemp,
  favourites,
  setLat,
  setLon,
}) {
  const [activeId, setActiveId] = useState(1);

  const changeCity = (id) => {
    setActiveId(id);
    const index = favourites.findIndex((x) => x.id === id);
    const [latitude, longitude] = favourites[index].value.split(" ");
    setLat(latitude);
    setLon(longitude);
  };

  return (
    <div>
      <section className={s.sidebarSection}>
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
              <div className={s.favouritesHeading}>
                <span>Favourite Locations</span>
                <FaRegStar />
              </div>
              {favourites.map((val, index) => (
                <li
                  key={index}
                  className={activeId === val.id ? s.active : s.linksLi}
                  onClick={() => changeCity(val.id)}
                >
                  <a href="#">
                    <GoLocation />
                    <span>{val.text}</span>
                  </a>
                </li>
              ))}
              <div className={s.preferencesHeading}>
                <span>Preferences</span>
                <GoSettings />
              </div>
              <div className={s.preferencesToggles}>
                <div className={s.checkbox_toggle} id={s.dn_cb}>
                  <input type="checkbox" className={s.checkbox} />
                  <div className={s.knobs}></div>
                  <div className={s.layer}></div>
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
                  <div className={s.layer}></div>
                </div>

                <div className={s.checkbox_toggle} id={s.time_cb}>
                  <input type="checkbox" className={s.checkbox} />
                  <div className={s.knobs}></div>
                  <div className={s.layer}></div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

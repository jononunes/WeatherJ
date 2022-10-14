import { useState, useEffect } from "react";
import { GoLocation, GoSettings } from "react-icons/go";
import { FaRegStar, FaTimes } from "react-icons/fa";
import Image from "next/image";

import { SidebarContainer } from "./SidebarElements";
import s from "../styles/mobileSidebar.module.scss";

export default function MobileSidebar({
  isOpen,
  toggle,
  switchUnit,
  tempChecked,
  changeTemp,
  favourites,
}) {
  const [activeId, setActiveId] = useState(1);

  return (
    <div>
      <SidebarContainer isOpen={isOpen}>
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
              <div className={s.favouritesHeading}>
                <span>Favourite Locations</span>
                <FaRegStar />
              </div>
              {favourites.map((val, index) => (
                <li
                  key={index}
                  className={activeId === val.id ? s.active : s.linksLi}
                  onClick={() => setActiveId(val.id)}
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
      </SidebarContainer>
    </div>
  );
}

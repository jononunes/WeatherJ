import { useState, useEffect } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { Link as LinkScroll } from "react-scroll";
import { AsyncPaginate } from "react-select-async-paginate";
import ReactEcharts from "echarts-for-react";
import { useQuery } from "react-query";
import axios from "axios";

import s from "../styles/weather.module.scss";
import { GEO_API_URL, geoApiOptions } from "../pages/api/cities/getCities";

const fetchWeather = async ({ queryKey }) => {
  const [_key, body] = queryKey;
  return await axios.get("/api/weather/getCurrentWeather", {
    params: { lat: body.lat, lon: body.lon, unit: body.unit },
  });
};

const fetchForecast = async ({ queryKey }) => {
  const [_key, body] = queryKey;
  return await axios.get("/api/weather/getForecast", {
    params: { lat: body.lat, lon: body.lon, unit: body.unit },
  });
};

export default function Weather({
  toggle,
  unit,
  favourites,
  setFavourites,
  lon,
  setLon,
  lat,
  setLat,
  modeChecked,
  timeChecked,
}) {
  const [daily, setDaily] = useState(true);

  const [search, setSearch] = useState({
    value: "26.2041 28.0473",
    label: "Johannesburg, South Africa",
  });

  const {
    isLoading,
    data: weather,
    isError,
    isSuccess,
    error,
  } = useQuery(
    ["fetchWeather", { lat: lat, lon: lon, unit: unit }],
    fetchWeather
  );

  const { isLoading: loadingForecast, data: forecastData } = useQuery(
    ["fetchForecast", { lat: lat, lon: lon, unit: unit }],
    fetchForecast
  );

  useEffect(() => {
    setTimeout(() => {
      const [latitude, longitude] = JSON.parse(
        localStorage.getItem("Favourites")
      )[0].value.split(" ");
      setLat(latitude);
      setLon(longitude);
    }, 1000);
  }, []);

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    const [latitude, longitude] = searchData.value.split(" ");
    setLat(latitude);
    setLon(longitude);
  };

  useEffect(() => {
    const index = favourites.findIndex((x) => x.value == `${lat} ${lon}`);
    if (index != -1) {
      setSearch({
        value: lat.toString() + " " + lon.toString(),
        label: favourites[index].text + ", " + favourites[index].country,
      });
    }
  }, [lat, lon]);

  const changeTab = () => {
    setDaily(!daily);
  };

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=50000&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.country}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  };

  const addFavourite = () => {
    setFavourites((favourites) => [
      ...favourites,
      {
        id: favourites[favourites.length - 1].id + 1,
        text: search.label.substring(0, search.label.indexOf(",")),
        country: search.label.substring(search.label.indexOf(",") + 1),
        value: search.value,
      },
    ]);
  };

  const removeFavourite = () => {
    const updatedFavourites = favourites;
    const index = favourites.findIndex((x) => x.value == search.value);
    updatedFavourites.splice(index, 1);
    setFavourites((updatedFavourites) => [...updatedFavourites]);
  };

  function convert12Hour(time) {
    let newHours = 0;

    if (parseInt(time) > 12) {
      newHours = parseInt(time) % 12;
      if (newHours >= 10) {
        return newHours.toString() + "PM";
      } else {
        return "0" + newHours.toString() + "PM";
      }
    } else {
      return time + "AM";
    }
  }

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const d = isLoading
    ? new Date()
    : new Date((weather.data.dt + weather.data.timezone) * 1000);
  let month = months[d.getMonth()];
  let nextMonth = months[d.getMonth() + 1];
  let minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();

  const values = [
    {
      id: 1,
      day: daily
        ? weekday[d.getDay()].substring(0, 3)
        : loadingForecast || isLoading
        ? ""
        : timeChecked
        ? convert12Hour(
            new Date(
              (forecastData.data.list[0].dt + weather.data.timezone) * 1000
            )
              .toUTCString()
              .substring(17, 19)
          )
        : new Date(
            (forecastData.data.list[0].dt + weather.data.timezone) * 1000
          )
            .toUTCString()
            .substring(17, 20) + "00",
      date: daily ? d.getDate() + " " + month.substring(0, 3) : "",
      image: loadingForecast
        ? "/partly-cloudy.png"
        : `/${forecastData.data.list[0].weather[0].main}.png`,
      temp: loadingForecast
        ? ""
        : forecastData.data.list[0].main.temp
            .toString()
            .substring(0, 2)
            .replace(".", "") + "°",
    },
    {
      id: 2,
      day: daily
        ? d.getDay() + 1 <= 6
          ? weekday[d.getDay() + 1].substring(0, 3)
          : weekday[d.getDay() - 7 + 1].substring(0, 3)
        : loadingForecast || isLoading
        ? ""
        : timeChecked
        ? convert12Hour(
            new Date(
              (forecastData.data.list[1].dt + weather.data.timezone) * 1000
            )
              .toUTCString()
              .substring(17, 19)
          )
        : new Date(
            (forecastData.data.list[1].dt + weather.data.timezone) * 1000
          )
            .toUTCString()
            .substring(17, 20) + "00",
      date: daily
        ? d.getDate() + 1 <= daysInMonths[d.getMonth()]
          ? d.getDate() + 1 + " " + month.substring(0, 3)
          : d.getDate() -
            daysInMonths[d.getMonth()] +
            1 +
            " " +
            nextMonth.substring(0, 3)
        : "",
      image: daily
        ? loadingForecast
          ? "/partly-cloudy.png"
          : `/${forecastData.data.list[7].weather[0].main}.png`
        : loadingForecast
        ? "/partly-cloudy.png"
        : `/${forecastData.data.list[1].weather[0].main}.png`,
      temp: daily
        ? loadingForecast
          ? ""
          : forecastData.data.list[7].main.temp
              .toString()
              .substring(0, 2)
              .replace(".", "") + "°"
        : loadingForecast
        ? ""
        : forecastData.data.list[1].main.temp
            .toString()
            .substring(0, 2)
            .replace(".", "") + "°",
    },
    {
      id: 3,
      day: daily
        ? d.getDay() + 2 <= 6
          ? weekday[d.getDay() + 2].substring(0, 3)
          : weekday[d.getDay() - 7 + 2].substring(0, 3)
        : loadingForecast || isLoading
        ? ""
        : timeChecked
        ? convert12Hour(
            new Date(
              (forecastData.data.list[2].dt + weather.data.timezone) * 1000
            )
              .toUTCString()
              .substring(17, 19)
          )
        : new Date(
            (forecastData.data.list[2].dt + weather.data.timezone) * 1000
          )
            .toUTCString()
            .substring(17, 20) + "00",
      date: daily
        ? d.getDate() + 2 <= daysInMonths[d.getMonth()]
          ? d.getDate() + 2 + " " + month.substring(0, 3)
          : d.getDate() -
            daysInMonths[d.getMonth()] +
            2 +
            " " +
            nextMonth.substring(0, 3)
        : "",
      image: daily
        ? loadingForecast
          ? "/partly-cloudy.png"
          : `/${forecastData.data.list[15].weather[0].main}.png`
        : loadingForecast
        ? "/partly-cloudy.png"
        : `/${forecastData.data.list[2].weather[0].main}.png`,
      temp: daily
        ? loadingForecast
          ? ""
          : forecastData.data.list[15].main.temp
              .toString()
              .substring(0, 2)
              .replace(".", "") + "°"
        : loadingForecast
        ? ""
        : forecastData.data.list[2].main.temp
            .toString()
            .substring(0, 2)
            .replace(".", "") + "°",
    },
    {
      id: 4,
      day: daily
        ? d.getDay() + 3 <= 6
          ? weekday[d.getDay() + 3].substring(0, 3)
          : weekday[d.getDay() - 7 + 3].substring(0, 3)
        : loadingForecast || isLoading
        ? ""
        : timeChecked
        ? convert12Hour(
            new Date(
              (forecastData.data.list[3].dt + weather.data.timezone) * 1000
            )
              .toUTCString()
              .substring(17, 19)
          )
        : new Date(
            (forecastData.data.list[3].dt + weather.data.timezone) * 1000
          )
            .toUTCString()
            .substring(17, 20) + "00",
      date: daily
        ? d.getDate() + 3 <= daysInMonths[d.getMonth()]
          ? d.getDate() + 3 + " " + month.substring(0, 3)
          : d.getDate() -
            daysInMonths[d.getMonth()] +
            3 +
            " " +
            nextMonth.substring(0, 3)
        : "",
      image: daily
        ? loadingForecast
          ? "/partly-cloudy.png"
          : `/${forecastData.data.list[23].weather[0].main}.png`
        : loadingForecast
        ? "/partly-cloudy.png"
        : `/${forecastData.data.list[3].weather[0].main}.png`,
      temp: daily
        ? loadingForecast
          ? ""
          : forecastData.data.list[23].main.temp
              .toString()
              .substring(0, 2)
              .replace(".", "") + "°"
        : loadingForecast
        ? ""
        : forecastData.data.list[3].main.temp
            .toString()
            .substring(0, 2)
            .replace(".", "") + "°",
    },
    {
      id: 5,
      day: daily
        ? d.getDay() + 4 <= 6
          ? weekday[d.getDay() + 4].substring(0, 3)
          : weekday[d.getDay() - 7 + 4].substring(0, 3)
        : loadingForecast || isLoading
        ? ""
        : timeChecked
        ? convert12Hour(
            new Date(
              (forecastData.data.list[4].dt + weather.data.timezone) * 1000
            )
              .toUTCString()
              .substring(17, 19)
          )
        : new Date(
            (forecastData.data.list[4].dt + weather.data.timezone) * 1000
          )
            .toUTCString()
            .substring(17, 20) + "00",
      date: daily
        ? d.getDate() + 4 <= daysInMonths[d.getMonth()]
          ? d.getDate() + 4 + " " + month.substring(0, 3)
          : d.getDate() -
            daysInMonths[d.getMonth()] +
            4 +
            " " +
            nextMonth.substring(0, 3)
        : "",
      image: daily
        ? loadingForecast
          ? "/partly-cloudy.png"
          : `/${forecastData.data.list[31].weather[0].main}.png`
        : loadingForecast
        ? "/partly-cloudy.png"
        : `/${forecastData.data.list[4].weather[0].main}.png`,
      temp: daily
        ? loadingForecast
          ? ""
          : forecastData.data.list[31].main.temp
              .toString()
              .substring(0, 2)
              .replace(".", "") + "°"
        : loadingForecast
        ? ""
        : forecastData.data.list[4].main.temp
            .toString()
            .substring(0, 2)
            .replace(".", "") + "°",
    },
  ];

  let option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 10,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 15,
            color: [
              [0.25, "#006400"],
              [0.5, "#FDDD60"],
              [0.75, "#FFA500"],
              [1, "#ed3419"],
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "10%",
          width: 30,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          length: 0,
          lineStyle: {
            color: "auto",
            width: 2,
          },
        },
        splitLine: {
          length: 0,
          lineStyle: {
            color: "auto",
            width: 0,
          },
        },
        axisLabel: {
          color: "#464646",
          fontSize: 20,
          distance: -50,
          formatter: function (value) {
            if (value === 0.875) {
              return "A";
            } else if (value === 0.625) {
              return "B";
            } else if (value === 0.375) {
              return "C";
            } else if (value === 0.125) {
              return "D";
            }
            return "";
          },
        },
        title: {
          offsetCenter: ["0%", "-20%"],
          fontSize: 30,
        },
        detail: {
          fontSize: 60,
          offsetCenter: [0, "0%"],
          valueAnimation: true,
          formatter: function (value) {
            return value;
          },
          color: "inherit",
        },
        data: [
          {
            value: 6,
          },
        ],
      },
    ],
  };
  return (
    <div>
      <section className={s.headerSection}>
        <video
          className={s.backgroundVideo}
          src={isLoading ? "" : `/${weather.data.weather[0].main}.mp4`}
          loop
          autoPlay={true}
          muted
          type="video/mp4"
          playsInline
        ></video>
        <div className={s.topSection}>
          <FaBars className={s.mobileIcon} onClick={toggle} />

          <div className={s.searchContainer}>
            <img src="/searchIcon.png" alt="" className={s.searchIcon} />
            <AsyncPaginate
              placeholder="Search location..."
              debounceTimeout={1500}
              value="Search location..."
              onChange={handleOnChange}
              className={s.searchBar}
              loadOptions={loadOptions}
            />
          </div>
          {favourites.some(
            (e) =>
              e.text === search.label.substring(0, search.label.indexOf(","))
          ) ? (
            <AiFillStar
              size={30}
              className={s.star}
              onClick={removeFavourite}
            />
          ) : (
            <AiOutlineStar
              size={30}
              className={s.star}
              onClick={addFavourite}
            />
          )}
        </div>
        <div className={s.middleSection}>
          <div className={s.locationContainer}>
            <IoLocationSharp className={s.locationPin} size={25} />
            <p className={s.city}>
              {search.label.substring(0, search.label.indexOf(","))}
            </p>
            <p className={s.country}>
              {search.label
                .substring(search.label.indexOf(",") + 1)
                .toUpperCase()}
            </p>
          </div>
          <div className={s.currentConditions}>
            <h1 className={isLoading ? s.loader : s.temperature}>
              {isLoading
                ? ""
                : weather.data.main.temp
                    .toString()
                    .substring(0, 2)
                    .replace(".", "") + "°"}
            </h1>
            <p className={s.condition}>
              {isLoading ? "" : weather.data.weather[0].main}
            </p>
          </div>
          <div className={s.dateTime}>
            <h1 className={s.date}>
              {isLoading
                ? ""
                : new Date((weather.data.dt + weather.data.timezone) * 1000)
                    .toUTCString()
                    .substring(0, 11)}
            </h1>
            <p className={s.time}>
              {isLoading
                ? ""
                : timeChecked
                ? convert12Hour(
                    new Date((weather.data.dt + weather.data.timezone) * 1000)
                      .toUTCString()
                      .substring(17, 19)
                  ).slice(0, 2) +
                  ":" +
                  minutes +
                  convert12Hour(
                    new Date((weather.data.dt + weather.data.timezone) * 1000)
                      .toUTCString()
                      .substring(17, 19)
                  ).slice(2)
                : new Date((weather.data.dt + weather.data.timezone) * 1000)
                    .toUTCString()
                    .substring(17, 20) + minutes}
            </p>
          </div>
        </div>
        <div className={isLoading ? s.noDisplay : s.bottomSection}>
          <div
            className={s.day_hour_tab}
            id={s.day_hour_tab}
            onClick={changeTab}
          >
            <input type="checkbox" className={s.checkbox} />
            <div className={s.knobs}></div>
            <div className={s.layer}></div>
          </div>
          <div className={s.bottomCards}>
            {values.map((val, index) => (
              <div className={s.bottomCard} key={index}>
                <h1 className={s.cardTitle}>{val.day}</h1>
                <h2 className={s.cardDate}>{val.date}</h2>
                <img src={val.image} alt="" className={s.cardIcon} />
                <p className={s.cardTemp}>{val.temp}</p>
              </div>
            ))}
          </div>
          <LinkScroll
            to="menu"
            smooth={true}
            duration={1000}
            spy={true}
            exact="true"
            activeClass="active"
            offset={-80}
          >
            <IoIosArrowDropdown size={30} className={s.downArrow} />
          </LinkScroll>
        </div>
      </section>
      <div>
        <section className={s.menuSection} id="menu">
          <video
            className={s.backgroundVideoMenu}
            src={isLoading ? "" : `/${weather.data.weather[0].main}.mp4`}
            loop
            autoPlay={true}
            muted
            type="video/mp4"
            playsInline
          ></video>
          <div className={s.menu}>
            <div className={s.columns}>
              <div className={`${s.leftCard} ${modeChecked && s.cardNight}`}>
                <div className={s.detail}>
                  <div className={s.title}>
                    <img src="/hilow.png" alt="" className={s.detailIcon} />
                    <h1
                      className={`${s.category} ${modeChecked && s.textNight}`}
                    >
                      Min/Max
                    </h1>
                  </div>
                  <p className={`${s.value} ${modeChecked && s.textNight}`}>
                    {isLoading
                      ? ""
                      : weather.data.main.temp_min
                          .toString()
                          .substring(0, 2)
                          .replace(".", "") +
                        "°/" +
                        weather.data.main.temp_max
                          .toString()
                          .substring(0, 2)
                          .replace(".", "") +
                        "°"}
                  </p>
                </div>
                <div className={s.divider} />
                <div className={s.detail}>
                  <div className={s.title}>
                    <img src="/feelslike.png" alt="" className={s.detailIcon} />
                    <h1
                      className={`${s.category} ${modeChecked && s.textNight}`}
                    >
                      Feels Like
                    </h1>
                  </div>
                  <p className={`${s.value} ${modeChecked && s.textNight}`}>
                    {isLoading
                      ? ""
                      : weather.data.main.feels_like
                          .toString()
                          .substring(0, 2)
                          .replace(".", "")}
                    °
                  </p>
                </div>
                <div className={s.divider} />
                <div className={s.detail}>
                  <div className={s.title}>
                    <img src="/pressure.png" alt="" className={s.detailIcon} />
                    <h1
                      className={`${s.category} ${modeChecked && s.textNight}`}
                    >
                      Pressure
                    </h1>
                  </div>
                  <p className={`${s.value} ${modeChecked && s.textNight}`}>
                    {isLoading ? "" : weather.data.main.pressure}mb
                  </p>
                </div>
                <div className={s.divider} />
                <div className={s.detail}>
                  <div className={s.title}>
                    <img src="/humidity.png" alt="" className={s.detailIcon} />
                    <h1
                      className={`${s.category} ${modeChecked && s.textNight}`}
                    >
                      Humidity
                    </h1>
                  </div>
                  <p className={`${s.value} ${modeChecked && s.textNight}`}>
                    {isLoading ? "" : weather.data.main.humidity}%
                  </p>
                </div>
                <div className={s.divider} />
                <div className={s.detail}>
                  <div className={s.title}>
                    <img
                      src="/visibility.png"
                      alt=""
                      className={s.detailIcon}
                    />
                    <h1
                      className={`${s.category} ${modeChecked && s.textNight}`}
                    >
                      Visibility
                    </h1>
                  </div>
                  <p className={`${s.value} ${modeChecked && s.textNight}`}>
                    {isLoading ? "" : weather.data.visibility}km
                  </p>
                </div>
              </div>
              <div className={s.rightCards}>
                <div className={`${s.rightCard} ${modeChecked && s.cardNight}`}>
                  <div className={s.cardColumns}>
                    <div className={s.sunriseColumn}>
                      <h1
                        className={`${s.cardHeading} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        Sunrise
                      </h1>
                      <p
                        className={`${s.sunTime} ${modeChecked && s.textNight}`}
                      >
                        {isLoading
                          ? ""
                          : new Date(
                              (weather.data.sys.sunrise +
                                weather.data.timezone) *
                                1000
                            )
                              .toUTCString()
                              .substring(17, 22)}
                      </p>
                      <img src="/sunrise.png" alt="" className={s.sunsetIcon} />
                    </div>
                    <div className={s.sunriseColumn}>
                      <h1
                        className={`${s.cardHeading} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        Sunset
                      </h1>
                      <p
                        className={`${s.sunTime} ${modeChecked && s.textNight}`}
                      >
                        {isLoading
                          ? ""
                          : new Date(
                              (weather.data.sys.sunset +
                                weather.data.timezone) *
                                1000
                            )
                              .toUTCString()
                              .substring(17, 22)}
                      </p>
                      <img src="/sunset.png" alt="" className={s.sunsetIcon} />
                    </div>
                  </div>
                </div>
                <div className={`${s.rightCard} ${modeChecked && s.cardNight}`}>
                  <div className={s.menuCardTitle}>
                    <h1
                      className={`${s.cardHeading} ${
                        modeChecked && s.textNight
                      }`}
                    >
                      Wind
                    </h1>
                    <img
                      src="/wind-icon.png"
                      alt=""
                      className={s.menuCardIcon}
                    />
                  </div>
                  <div className={s.cardColumns}>
                    <div className={s.windColumn}>
                      <img src="/windspeed.png" alt="" className={s.windIcon} />
                      <h1
                        className={`${s.windHeading} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        Speed
                      </h1>
                      <p
                        className={`${s.windValue} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        {isLoading ? "" : weather.data.wind.speed}km/h
                      </p>
                    </div>
                    <div className={s.windColumn}>
                      <img
                        src="/winddirection.png"
                        alt=""
                        className={s.windIcon}
                      />
                      <h1
                        className={`${s.windHeading} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        Direction
                      </h1>
                      <p
                        className={`${s.windValue} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        {isLoading ? "" : weather.data.wind.deg}°
                      </p>
                    </div>
                    <div className={s.windColumn}>
                      <img src="/windgusts.png" alt="" className={s.windIcon} />
                      <h1
                        className={`${s.windHeading} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        Gust
                      </h1>
                      <p
                        className={`${s.windValue} ${
                          modeChecked && s.textNight
                        }`}
                      >
                        {isLoading ? "" : weather.data.wind.speed}km/h
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${s.rightCard} ${modeChecked && s.cardNight}`}>
                  <div className={s.menuCardTitle}>
                    <h1
                      className={`${s.cardHeading} ${
                        modeChecked && s.textNight
                      }`}
                    >
                      UV Index
                    </h1>
                    <img src="/uvicon.png" alt="" className={s.menuCardIcon} />
                  </div>
                  <ReactEcharts option={option} className={s.uvIndex} />
                </div>
              </div>
            </div>
            <p className={s.copyright}>Copyright © 2022 • WeatherJ</p>
          </div>
        </section>
      </div>
    </div>
  );
}

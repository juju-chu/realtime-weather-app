// STEP 1：載入會用到的 React Hooks
import { useState, useEffect, useCallback } from 'react'

const fetchCurrentWeather = (locationName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-B1A98B60-ACBC-4F8E-ACA5-F7CB99425BD3&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue
          }
          return neededElements
        }
      )

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        description: '',
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      }
    })
}

const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-507B37E0-0383-4D8C-878D-628B54EC3536&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("data: ", data);
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter
          }
          return neededElements
        },
        {}
      )

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      }
    })
}

const useWeatherApi = (currentLocation) => {
  const { locationName, cityName } = currentLocation
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading: true,
  })

  const fetchData = useCallback(() => {
    setWeatherElement((preState) => {
      return {
        ...preState,
        isLoading: true,
      }
    })
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName),
      ])

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      })
    }

    fetchingData()
  }, [locationName, cityName])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // STEP 5：把要給其他 React 組件使用的資料或方法回傳出去
  return [weatherElement, fetchData]
}

export default useWeatherApi

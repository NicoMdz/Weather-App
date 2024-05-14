import axios from "axios"
import {set, z} from "zod"
// import {object, string, number, Output, parse} from "valibot"
import { SearchType } from "../types"
import { useMemo, useState } from "react"

/* TYPE GUARD O ASSERTION
function isWeatherResponse(weather : unknown) : weather is Weather {
    return (
        Boolean(weather) &&
        typeof weather === "object" &&
        typeof (weather as Weather).name === "string" &&
        typeof (weather as Weather).main.temp === "number" &&
        typeof (weather as Weather).main.tem_min === "number" &&
        typeof (weather as Weather).main.temp_max === "number"

    )
} */

//Valibot - Definir schema
// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_max: number(),
//         temp_min: number()
//     })
// })
// type Weather = Output<typeof WeatherSchema>

//Zod - Definir un schema
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number(),

    })
})
export type Weather = z.infer<typeof Weather>

const initialState = {
    name: "",
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
}

export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const fetchWeather = async (search : SearchType) => {
      
       const appId = import.meta.env.VITE_API_KEY 
       setLoading(true)
       setWeather(initialState)
       try {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

        const {data} = await axios(geoUrl)

        //Comprobar si existe la ciudad
        if (!data[0]) {
            setNotFound(true)
        }
        const lat = data[0].lat
        const lon = data[0].lon

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

        // ZOD
        const {data: weatherResult} = await axios(weatherUrl)
        const result = Weather.safeParse(weatherResult)
        if (result.success) {
            setWeather(result.data)
        }


        //Valibot
        // const {data: weatherResult} = await axios(weatherUrl)
        // const result = parse(WeatherSchema, weatherResult)        
            
        /*   Type Guard  
        const {data: weatherResult} = await axios(weatherUrl) 
        const result = isWeatherResponse(weatherResult)
        if (result) {
            console.log("hols")
        } */
       } catch (error) {
        console.log(error)     
       } finally { //Finally se ejecuta siempre independientemente de si el try falla
            setLoading(false)
       }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])

    return { 
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData,
    }
}
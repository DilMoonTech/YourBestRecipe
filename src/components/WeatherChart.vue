<template>
  <div>
    <h2>Weather Data for {{ city }}</h2>
    <!--input v-model="city" placeholder="Enter city" @keyup.enter="fetchData" /-->
    <!--button @click="fetchData">Get Data</button-->
    <div v-if="data">
      <!-- Table to display data -->
      <table border="1" cellpadding="5" cellspacing="0" hidden>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature (°C)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hour, index) in data.hourly.time" :key="index">
            <td>{{ hour }}</td>
            <td>{{ data.hourly.temperature2m[index] }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Chart.js chart -->
    </div>
    <canvas ref="chartRef" width="600" height="400"></canvas>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { fetchWeatherApi } from 'openmeteo'
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
//import axios from 'axios'

const url = 'https://api.open-meteo.com/v1/forecast'
const params = {
  latitude: 48.866667,
  longitude: 2.333333,
  hourly: 'temperature_2m',
  daily: 'weather_code',
  timezone: 'GMT',
  DateTimeFormat: 'locale',
}

interface Data {
  hourly: {
    time: string[]
    temperature2m: Float32Array
  }
  daily: {
    time: Date[]
    weatherCode: Float32Array
  }
}

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step)
const city = ref<string>('Paris, France')
const data = ref<Data | null>(null)
const chartRef = ref(null)

const fetchData = async () => {
  try {
    const responses = await fetchWeatherApi(url, params)
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0]
    console.log(response)

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds()
    //const timezone = response.timezone()
    //const timezoneAbbreviation = response.timezoneAbbreviation()
    //const latitude = response.latitude()
    //const longitude = response.longitude()
    const hourly = response.hourly()!
    const daily = response.daily()!

    const hourlyTemperatures = hourly.variables(0)!.valuesArray()!
    const hourlyTimes = range(
      Number(hourly.time()),
      Number(hourly.timeEnd()),
      hourly.interval(),
    ).map((t) => new Date((t + utcOffsetSeconds) * 1000))

    // Note: The order of weather variables in the URL query and the indices below need to match!
    data.value = {
      hourly: {
        time: hourlyTimes.map((t) =>
          t.toLocaleDateString('en-US', {
            weekday: 'short', // Abbreviated weekday name (e.g., Mon, Tue)
            month: 'short', // Abbreviated month name (e.g., Jan, Feb)
            day: 'numeric', // Day of the month (e.g., 27)
            year: 'numeric', // Year (e.g., 2025)
            hour: 'numeric', // Hour (e.g., 23)
          }),
        ),
        temperature2m: hourlyTemperatures.map((temp) => Math.round((temp * 10) / 10)),
      },

      daily: {
        time: range(Number(daily.time()!), Number(daily.timeEnd()), daily.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000),
        ),
        weatherCode: daily.variables(0)!.valuesArray()!,
      },
    }
  } catch (error) {
    alert('Failed to fetch data: ')
    console.error(error)
  }
}

const setupChart = async () => {
  // Chart.js logic to create the chart
  console.log('Setting up chart:', chartRef.value)
  Chart.register(
    CategoryScale,
    LinearScale,
    LineElement,
    LineController,
    PointElement,
    Title,
    Tooltip,
    Legend,
  )
  if (chartRef.value) {
    new Chart(chartRef.value, {
      type: 'line', // Type of the chart
      data: {
        labels: data.value?.hourly.time, // x-axis labels
        datasets: [
          {
            label: 'Temperature (°C)',
            data: data.value?.hourly.temperature2m, // y-axis data
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category', // This is to handle string time on the x-axis
            title: {
              display: true,
              text: 'Time',
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°C)',
            },
          },
        },
      },
    })
  }
}

onMounted(async () => {
  await fetchData()
  // Ensure chart setup happens after DOM updates
  nextTick(async () => {
    await setupChart()
  })
})
</script>

<style scoped>
input {
  padding: 10px;
  margin: 10px;
}
button {
  padding: 10px;
  background-color: #42b983;
  border: none;
  color: white;
}
</style>

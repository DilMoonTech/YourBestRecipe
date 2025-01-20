import { mount, flushPromises } from '@vue/test-utils'
import WeatherComponent from '@/components/WeatherChart.vue'
import { beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { Chart } from 'chart.js'
import { fetchWeatherApi } from 'openmeteo'

// Mock the fetchWeatherApi function
vi.mock('openmeteo', () => ({
  fetchWeatherApi: vi.fn(),
}))

describe('WeatherComponent', () => {
  let mockFetchWeatherApi: Mock

  beforeAll(() => {
    // Mock the Chart.js to avoid rendering the actual chart
    vi.spyOn(Chart, 'register').mockImplementation(() => {})
  })

  beforeEach(() => {
    mockFetchWeatherApi = fetchWeatherApi as Mock
  })

  it('should mount the component', () => {
    const wrapper = mount(WeatherComponent)
    expect(wrapper.exists()).toBe(true) // Check if the component is rendered
  })

  it.skip('fetches data and renders the table', async () => {
    const mockData = {
      hourly: {
        time: ['2025-01-20T00:00:00.000Z', '2025-01-20T01:00:00.000Z'],
        temperature2m: [0.95, 1.1],
      },
      daily: {
        time: ['2025-01-20T00:00:00.000Z', '2025-01-21T01:00:00.000Z'],
        weatherCode: [1, 2],
      },
    }

    // Mock the API response
    mockFetchWeatherApi.mockResolvedValue([mockData])

    const wrapper = mount(WeatherComponent)

    // Wait for the fetchData to be completed
    await flushPromises()

    // Check if the table rows are rendered correctly
    const rows = wrapper.findAll('tbody tr')
    console.log(wrapper.vm.$data)
    expect(rows).toHaveLength(2)

    // Check the first row values
    expect(rows[0].text()).toContain('2025-01-20, 12:00 AM') // assuming you formatted it that way
    expect(rows[0].text()).toContain('1.1')

    // Check the second row values
    expect(rows[1].text()).toContain('2025-01-20, 1:00 AM')
    expect(rows[1].text()).toContain('1.1')
  })

  it('initializes the chart', async () => {
    const mockData = {
      hourly: {
        time: ['2025-01-20T00:00:00.000Z', '2025-01-20T01:00:00.000Z'],
        temperature2m: [0.95, 1.1],
      },
      daily: {
        time: ['2025-01-20T00:00:00.000Z', '2025-01-21T01:00:00.000Z'],
        weatherCode: [1, 2],
      },
    }

    mockFetchWeatherApi.mockResolvedValue([mockData])

    mount(WeatherComponent)
    await flushPromises()

    // Check if the chart setup is triggered
    expect(Chart.register).toHaveBeenCalled()
  })

  it.skip('handles API errors gracefully', async () => {
    // Simulate API failure
    mockFetchWeatherApi.mockRejectedValue(new Error('API Error'))

    mount(WeatherComponent)

    // Wait for the component to attempt fetching data
    await flushPromises()

    // Ensure that the error is caught and handled (e.g., alert is triggered)
    expect(console.error).toHaveBeenCalledWith('Failed to fetch data: ')
  })
})

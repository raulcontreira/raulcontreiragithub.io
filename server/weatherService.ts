import { ENV } from './_core/env';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: Date;
}

export interface ForecastDay {
  date: Date;
  temperature: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface OpenWeatherCurrentResponse {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number };
  weather: Array<{ description: string; icon: string }>;
  dt: number;
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{ description: string; icon: string }>;
    wind: { speed: number };
  }>;
}

const weatherCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

function getCachedData<T>(key: string): T | null {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  weatherCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  weatherCache.set(key, { data, timestamp: Date.now() });
}

export async function getCurrentWeatherByCity(city: string): Promise<WeatherData> {
  const cacheKey = `current_city_${city.toLowerCase()}`;
  const cached = getCachedData<WeatherData>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY não está configurada');
  }

  const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
  
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Cidade não encontrada');
    }
    throw new Error(`Erro ao buscar dados do tempo: ${response.statusText}`);
  }

  const data: OpenWeatherCurrentResponse = await response.json();
  
  const weatherData: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: new Date(data.dt * 1000),
  };

  setCachedData(cacheKey, weatherData);
  return weatherData;
}

export async function getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const cacheKey = `current_coords_${lat}_${lon}`;
  const cached = getCachedData<WeatherData>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY não está configurada');
  }

  const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar dados do tempo: ${response.statusText}`);
  }

  const data: OpenWeatherCurrentResponse = await response.json();
  
  const weatherData: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: new Date(data.dt * 1000),
  };

  setCachedData(cacheKey, weatherData);
  return weatherData;
}

export async function getForecastByCity(city: string): Promise<ForecastDay[]> {
  const cacheKey = `forecast_city_${city.toLowerCase()}`;
  const cached = getCachedData<ForecastDay[]>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY não está configurada');
  }

  const url = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
  
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Cidade não encontrada');
    }
    throw new Error(`Erro ao buscar previsão: ${response.statusText}`);
  }

  const data: OpenWeatherForecastResponse = await response.json();
  
  // Agrupar por dia (pegar a previsão do meio-dia de cada dia)
  const dailyForecasts = new Map<string, ForecastDay>();
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    const hour = date.getHours();
    
    // Pegar a previsão mais próxima do meio-dia
    if (!dailyForecasts.has(dateKey) || Math.abs(hour - 12) < Math.abs(dailyForecasts.get(dateKey)!.date.getHours() - 12)) {
      dailyForecasts.set(dateKey, {
        date: date,
        temperature: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      });
    }
  });

  const forecast = Array.from(dailyForecasts.values()).slice(0, 5);
  setCachedData(cacheKey, forecast);
  return forecast;
}

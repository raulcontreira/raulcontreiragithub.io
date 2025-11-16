import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, MapPin, Wind, Droplets, Gauge, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Query para buscar tempo atual por cidade
  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = trpc.weather.getCurrentByCity.useQuery(
    { city: searchCity },
    { enabled: !!searchCity && !useGeolocation }
  );

  // Query para buscar tempo atual por coordenadas
  const { data: weatherDataCoords, isLoading: weatherCoordsLoading } = trpc.weather.getCurrentByCoords.useQuery(
    { lat: coords?.lat || 0, lon: coords?.lon || 0 },
    { enabled: !!coords && useGeolocation }
  );

  // Query para buscar previsão de 5 dias
  const { data: forecastData, isLoading: forecastLoading } = trpc.weather.getForecast.useQuery(
    { city: searchCity || weatherDataCoords?.city || "" },
    { enabled: !!(searchCity || weatherDataCoords?.city) }
  );

  const currentWeather = useGeolocation ? weatherDataCoords : weatherData;
  const isLoading = weatherLoading || weatherCoordsLoading || forecastLoading;

  // Registrar service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchCity(city.trim());
      setUseGeolocation(false);
      setCoords(null);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo navegador");
      return;
    }

    toast.info("Obtendo sua localização...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setUseGeolocation(true);
        setSearchCity("");
        toast.success("Localização obtida com sucesso!");
      },
      (error) => {
        toast.error("Erro ao obter localização: " + error.message);
      }
    );
  };

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600">
      <div className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Weather PWA
          </h1>
          <p className="text-blue-100 text-lg">
            Previsão do tempo em tempo real
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 shadow-2xl border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Digite o nome da cidade..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 h-12 text-lg"
              />
              <Button type="submit" size="lg" className="h-12 px-6">
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
              <Button 
                type="button" 
                size="lg" 
                variant="secondary" 
                onClick={handleGeolocation}
                className="h-12 px-6"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Minha Localização
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        )}

        {/* Error State */}
        {weatherError && !isLoading && (
          <Card className="shadow-xl border-0 bg-red-50">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 text-lg">
                {weatherError.message || "Erro ao buscar dados do tempo"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Weather Data */}
        {currentWeather && !isLoading && (
          <>
            {/* Current Weather */}
            <Card className="mb-8 shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">
                      {currentWeather.city}, {currentWeather.country}
                    </h2>
                    <p className="text-blue-100 text-lg capitalize">
                      {currentWeather.description}
                    </p>
                  </div>
                  <img 
                    src={getWeatherIcon(currentWeather.icon)} 
                    alt={currentWeather.description}
                    className="w-32 h-32"
                  />
                </div>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-7xl font-bold">
                    {currentWeather.temperature}°
                  </span>
                  <span className="text-3xl ml-2 text-blue-100">C</span>
                </div>
                
                <p className="text-blue-100 mt-2">
                  Sensação térmica: {currentWeather.feelsLike}°C
                </p>
              </div>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Wind className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vento</p>
                      <p className="text-xl font-semibold">{currentWeather.windSpeed} m/s</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Droplets className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Umidade</p>
                      <p className="text-xl font-semibold">{currentWeather.humidity}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Gauge className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pressão</p>
                      <p className="text-xl font-semibold">{currentWeather.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5-Day Forecast */}
            {forecastData && forecastData.length > 0 && (
              <Card className="shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calendar className="w-6 h-6" />
                    Previsão para os próximos dias
                  </CardTitle>
                  <CardDescription>
                    Previsão estendida de 5 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecastData.map((day, index) => (
                      <Card key={index} className="border-2 hover:border-primary transition-colors">
                        <CardContent className="pt-6 text-center">
                          <p className="font-semibold text-sm mb-2">
                            {formatDate(day.date)}
                          </p>
                          <img 
                            src={getWeatherIcon(day.icon)} 
                            alt={day.description}
                            className="w-20 h-20 mx-auto"
                          />
                          <p className="text-2xl font-bold my-2">
                            {day.temperature}°C
                          </p>
                          <p className="text-xs text-muted-foreground mb-2 capitalize">
                            {day.description}
                          </p>
                          <div className="flex justify-center gap-2 text-xs text-muted-foreground">
                            <span>↑{day.tempMax}°</span>
                            <span>↓{day.tempMin}°</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Initial State */}
        {!currentWeather && !isLoading && !weatherError && (
          <Card className="shadow-xl border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Bem-vindo ao Weather PWA
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  Digite o nome de uma cidade ou use sua localização para ver a previsão do tempo
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="lg" onClick={() => document.querySelector('input')?.focus()}>
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Cidade
                  </Button>
                  <Button size="lg" variant="secondary" onClick={handleGeolocation}>
                    <MapPin className="w-5 h-5 mr-2" />
                    Usar Minha Localização
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/80">
          <p className="text-sm">
            Dados fornecidos por OpenWeatherMap API
          </p>
        </div>
      </div>
    </div>
  );
}

export interface WeatherLocation {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
}

export interface WeatherCondition {
    text: string;
    icon: string;
    code: number;
}

export interface WeatherCurrent {
    temp_c: number;
    feelslike_c: number;
    condition: WeatherCondition;
    wind_kph: number;
    wind_degree: number;
    humidity: number;
    pressure_mb: number;
    vis_km: number;
    cloud: number;
    last_updated: string;
}

export interface WeatherData {
    location: WeatherLocation;
    current: WeatherCurrent;
}
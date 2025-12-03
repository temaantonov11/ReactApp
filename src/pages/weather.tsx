import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { WeatherData } from '../types/weather.ts';
import './weather.css';

const API_KEY = '8b6e40f2bc4142c4ba8172326252110';
const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;


export default function Weather() {
    const [city, setCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    const getWindDirection = (degrees: number): string => {
        if (!degrees) return 'Не указано';
        
        const directions = [
            'Северный', 'Северо-восточный', 'Восточный', 
            'Юго-восточный', 'Южный', 'Юго-западный', 
            'Западный', 'Северо-западный'
        ];
        const index = Math.round(degrees / 45) % 8;
        return directions[index] + ` (${degrees}°)`;
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
        if (error) setError('');
    };
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const cityName = city.trim();
        
        if (!cityName) {
            setError('Введите название города');
            return;
        }
        
        setLoading(true);
        setError('');
        setWeatherData(null);
        
        try {
            const url = `${API_URL}&q=${encodeURIComponent(cityName)}&lang=ru`;
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Город не найден. Проверьте правильность написания.');
                } else if (response.status === 401) {
                    throw new Error('Неверный API ключ. Проверьте настройки.');
                } else if (response.status === 403) {
                    throw new Error('Доступ запрещен. Проверьте API ключ.');
                } else {
                    throw new Error('Ошибка сервера. Попробуйте позже.');
                }
            }
            
            const data: WeatherData = await response.json();
            setWeatherData(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };
    
    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(event as any);
        }
    };
    
    return (
        <div className='weather-app'>
            <h1>Погода</h1>
            
            <form onSubmit={handleSubmit} className='search-section'>
                <input
                    type='text'
                    className='city-input'
                    placeholder='Введите город...'
                    value={city}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button 
                    type='submit'
                    className='search-btn'
                    disabled={loading}
                >
                    {loading ? 'Поиск...' : 'Поиск'}
                </button>
            </form>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {loading && (
                <div className="loading">
                    🔍 Ищем погоду для {city}...
                </div>
            )}
            
            {weatherData && !loading && (
                <div className="weather-result">
                    <div className="weather-card">
                        <div className="weather-main">
                            <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
                            <div>
                                <div>Обновлено: {new Date(weatherData.current.last_updated).toLocaleString('ru-RU')}</div>
                                <div>Регион: {weatherData.location.region || 'Не указан'}</div>
                            </div>
                            
                            <div className="temperature-section">
                                <div className="temperature">{Math.round(weatherData.current.temp_c)}°C</div>
                                <div className="feels-like">Ощущается как: {Math.round(weatherData.current.feelslike_c)}°C</div>
                                <div className="weather-description">
                                    <img 
                                        src={`https:${weatherData.current.condition.icon}`} 
                                        alt={weatherData.current.condition.text}
                                        className="weather-icon-img"
                                    />
                                    <span>{weatherData.current.condition.text}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="weather-details">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="value">
                                        Ветер: {getWindDirection(weatherData.current.wind_degree)}, {weatherData.current.wind_kph} км/ч
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="value">Влажность: {weatherData.current.humidity}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="value">Давление: {weatherData.current.pressure_mb} hPa</span>
                                </div>
                                <div className="detail-item">
                                    <span className="value">Видимость: {weatherData.current.vis_km} км</span>
                                </div>
                                <div className="detail-item">
                                    <span className="value">Облачность: {weatherData.current.cloud}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="value">Часовой пояс: {weatherData.location.tz_id}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="value">
                                        Координаты: {weatherData.location.lat.toFixed(2)}, {weatherData.location.lon.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="api-info">
                            <p>Данные предоставлены WeatherAPI</p>
                        </div>
                    </div>
                </div>
            )}
            
            {!weatherData && !loading && !error && (
                <div className="placeholder">
                    Введите название города, чтобы узнать погоду
                </div>
            )}
        </div>
    );
}
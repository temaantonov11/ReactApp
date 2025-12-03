import React, { useEffect, useState } from "react";
import './CryptoPrice.css';

interface Coin {
  id: string;
  name: string;
}

export const CryptoPrice: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [crypto, setCrypto] = useState("bitcoin");
  const [fiat, setFiat] = useState("usd");
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCoins = async () => {
    try {
      setListLoading(true);
      const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
      if (!response.ok) throw new Error("Ошибка загрузки списка монет");
      const data: Coin[] = await response.json();
      setCoins(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setListLoading(false);
    }
  };

  const fetchPrice = async () => {
    try {
      if (!crypto) return;
      setLoading(true);
      setPrice(null);
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Ошибка получения цены");
      const data = await response.json();
      const value = data[crypto]?.[fiat];
      if (value === undefined) {
        setError("Цена не найдена");
        return;
      }
      const cryptoName = coins.find(c => c.id === crypto)?.name || crypto.toUpperCase();
      setPrice(`1 ${cryptoName} = ${value.toLocaleString("ru-RU")} ${fiat.toUpperCase()}`);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Ошибка получения цены");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      fetchPrice();
    }
  }, [coins, crypto, fiat]);

  return (
    <div className="crypto-price-container">
      <h2>Crypto Price Checker</h2>
      {listLoading && <div className="loading">Загрузка списка монет...</div>}
      {error && <div className="loading">{error}</div>}
      {!listLoading && coins.length > 0 && (
        <>
          <select
            className="crypto-select"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
          <select
            className="fiat-select"
            value={fiat}
            onChange={(e) => setFiat(e.target.value)}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="rub">RUB</option>
          </select>
          <div className="price-result">
            {loading ? "Получение цены..." : price}
          </div>
        </>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import "./PokemonList.css"

const typeColorsMapping: Record<string, string> = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dark: "#705848",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  normal: "#A8A878",
};

interface PokemonType {
    type: { name: string };
}

interface PokemonAbility {
    ability: { name: string };
}

interface PokemonStat {
    base_stat: number;
    stat: { name: string };
}

interface PokemonInfo {
    name: string;
    sprites: { front_default: string };
    types: PokemonType[];
    abilities: PokemonAbility[];
    stats: PokemonStat[];
    url?: string;
}

interface PokemonListItem {
    name: string;
    url: string;
}

interface PokemonListResponse {
    results: PokemonListItem[];
}

const POKEMONS_API_URL = "https://pokeapi.co/api/v2";


const getPokemons = async (limit: number): Promise<PokemonListItem[]> => {
    try {
        const res = await fetch(`${POKEMONS_API_URL}/pokemon?limit=${limit}`);
        if (!res.ok) {
            throw new Error(`Ошибка при загрузке списка покемонов: ${res.status} ${res.statusText}`)
        }
        const data: PokemonListResponse = await res.json();
        return data.results;
    } catch (error: any) {
        console.error("getPokemons:", error);
        throw new Error(error.message || "Неизвестная ошибка при загрузке списка покемонов");
    }
}


const getPokemonInfo = async (url: string): Promise<PokemonInfo> => {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Ошибка при загрузке информации о покемоне: ${res.status} ${res.statusText}`);
        }
        const data: PokemonInfo = await res.json();
        return data;
    } catch (error: any) {
        console.error("getPokemonInfo:", error);
        throw new Error(error.message || "Неизвестная ошибка при загрузке информации о покемоне");
    }
}

export const PokemonList: React.FC = () => {
    const [pokemons, setPokemons] = useState<PokemonInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const list = await getPokemons(200);
                const infos = await Promise.all(list.map(p => getPokemonInfo(p.url)));
                setPokemons(infos);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || "Неизвестная ошибка при загрузке покемонов");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading"> Загрузка... </div>
    if (error) return <div className="loading" style={{ color: "#FF5555" }}>{error}</div>
 
    return(
        <div className="pokemons-cards-block">
            {pokemons.map(p => (
                <div
                    key={p.name}
                    className="pokemon-card"
                    style={{ backgroundColor: typeColorsMapping[p.types[0].type.name] || "#f8f8f8d3" }}
                >
                    <h2>{p.name}</h2>
                    <img src={p.sprites.front_default} alt={p.name} className="pokemon-icon" />
                    <p>Type: {p.types.map(t => t.type.name).join(", ")}</p>
                    <p>Ablities: {p.abilities.map(a => a.ability.name).join(", ")}</p>
                    <div className="stats">
                        {p.stats.map(stat => (
                            <div key={stat.stat.name} className="stat-row">
                                <span>{stat.stat.name}</span>
                                <div className="stat-bar">
                                    <div className="stat-value" style={{ width: stat.base_stat + "px" }}>
                                        {stat.base_stat}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
import { useEffect,useState } from "react";
import axios from 'axios';
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
function PokemonList() {
    const [pokemonList,setPokemonList]= useState([]);
    const [isLoading,setIsLoading]= useState(true);

   const [pokedexUrl,setPokedexUrl] =useState('https://pokeapi.co/api/v2/pokemon');

   const[nextUrl,setNextUrl]=useState('');
   const[prevUrl,setPrevUrl]=useState('');


    async function downloadPokemons() {
        setIsLoading(true);
        const response = await axios.get(pokedexUrl); //THIS DOWNLAODS LIST OF 20 POKEMONS

        const pokemonResults = response.data.results; // WE GET THE ARRAY OF POKEMONS FROM RESULT

        console.log(response.data);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);
        //iterating over the aaray the pokemon and using their url , to cresate ana aaray of promises 
        //that will dowwnlaod those 20 pokemons
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        //passing that array to axios.all similar to .then
        const pokemonData = await axios.all(pokemonResultPromise); //array of 20 poekomn detailed data
        console.log(pokemonData);

        //iterate on detailed data of each poekmon and extract id image name types
        const pokeListresult = pokemonData.map((pokeData) =>
        {
            const pokemon =pokeData.data;
            return{
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default: pokemon.sprites.front_shiny, 
                types: pokemon.types

            }
        });
        console.log(pokeListresult);
        setPokemonList(pokeListresult);
        setIsLoading(false);

    }
    useEffect(() => { downloadPokemons();}, [pokedexUrl]);
    return (
        
            <div className="pokemon-list-wrapper">
                
                
                <div className="pokemon_wrapper">
                {(isLoading)? 'Loading....' : 
                pokemonList.map((p)=>  <Pokemon name={p.name} image={p.image}  key={p.id} />)
                }
                </div>
            <div className="controls">
                <button disabled={prevUrl==null} onClick={()=> setPokedexUrl(prevUrl)}>Previous</button>
                <button disabled={nextUrl==null} onClick={()=> setPokedexUrl(nextUrl)}>Next</button>
            </div>
            </div>
    )
}
export default PokemonList;
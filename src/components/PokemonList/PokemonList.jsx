import { useEffect,useState } from "react";
import axios from 'axios';
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";
// import { preview } from "vite";
function PokemonList() {
//     const [pokemonList,setPokemonList]= useState([]);
//     const [isLoading,setIsLoading]= useState(true);

//    const [pokedexUrl,setPokedexUrl] =useState('https://pokeapi.co/api/v2/pokemon');

//    const[nextUrl,setNextUrl]=useState('');
//    const[prevUrl,setPrevUrl]=useState('');

   const[pokemonListState,setPokemonListState]=useState({
    pokemonList:[],
    isLoading:true,
    pokedexUrl:'https://pokeapi.co/api/v2/pokemon',
    nextUrl: '',
    prevUrl:'',

   })


    async function downloadPokemons() {
        // setIsLoading(true);
        setPokemonListState((state)=>({...state, isLoading:true}));
        const response = await axios.get(pokemonListState.pokedexUrl); //THIS DOWNLAODS LIST OF 20 POKEMONS

        const pokemonResults = response.data.results; // WE GET THE ARRAY OF POKEMONS FROM RESULT

        console.log(response.data);
        setPokemonListState((state)=>({
            ...state,
            nextUrl: response.data.next,
             prevUrl:response.data.previous
            }));
        
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
                id: pokemon.id, 
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default: pokemon.sprites.front_shiny, 
                types: pokemon.types

            }
        });
        console.log(pokeListresult);
        setPokemonListState((state)=>({
            ...state,
             pokemonList: pokeListresult,
              isLoading: false
            }));
        

    }
    useEffect(() => { downloadPokemons();},
     [pokemonListState.pokedexUrl]);
    return (
        
            <div className="pokemon-list-wrapper">
                
                
                <div className="pokemon_wrapper">
                {(pokemonListState.isLoading)? 'Loading....' : 
                pokemonListState.pokemonList.map((p)=>  <Pokemon name={p.name} image={p.image}  key={p.id} id={p.id} />)
                }
                </div>
            <div className="controls">
                <button disabled={pokemonListState.prevUrl==null} onClick={()=> {const urlToSet = pokemonListState.prevUrl;
                    setPokemonListState({...pokemonListState,pokedexUrl: urlToSet})}
                }>Previous</button>
                <button disabled={pokemonListState.nextUrl==null}onClick={()=> {const urlToSet = pokemonListState.nextUrl;
                    setPokemonListState({...pokemonListState,pokedexUrl: urlToSet})}
                }>Next</button>
            </div>
            </div>
    )
}
export default PokemonList;
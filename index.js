const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const exphbs = require('express-handlebars');
// eslint-disable-next-line no-unused-vars
const helpers = require('handlebars-helpers')(['string']);
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3005;

const catchErrors = asyncFunction => (...args) => asyncFunction(...args).catch(console.error);

const getAllPokemon = catchErrors(async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=151');
    const resJson = await res.json();
    return resJson;
});

const searchPokemon = catchErrors(async (pokemon = 'solgaleo') => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
    const resJson = await res.json();
    return resJson;
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.engine(".hbs", exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', catchErrors(async (_, res) => {
    const pokemons = await getAllPokemon();
    res.render('home', {
        pokemons: pokemons.results
    });
}));

app.post('/search', (req, res) => {
    const search = req.body.search;
    console.log(search);
    res.redirect(`/${search}`)
});

app.get('/notfound', (_, res) => res.render('404'));

app.get('/:pokemon', catchErrors(async (req, res) => {
    const pokemon = await searchPokemon(req.params.pokemon);
    if (pokemon) {
        res.render('result', {
            pokemonName: pokemon.name,
            pokemonImg: pokemon.sprites.other["official-artwork"].front_default,
            pokemonType: pokemon.types,
            pokemonWeight: pokemon.weight,
            pokemonHeight: pokemon.height
        });
    } else {
        res.redirect('/notfound');
    }
}));

app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});
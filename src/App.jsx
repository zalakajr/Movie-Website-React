import React, { useEffect, useState } from 'react'
import Search from './components/search'
import Spiner from './components/spiner';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setsearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('')

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setisLoading] = useState(false);

  const fetchMovies = async () => {

    setisLoading(true)
    setErrorMessage('')
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");

      }

      const data = await response.json();

      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    } finally {
      setisLoading(false)
    }
  }

  useEffect(() => {

    fetchMovies();
  }, []);

  return (
    <main>

      <div className="pattern" />

      <div className="wrapper">
        <header>

          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className='mt-[40px]'>
            All Movies
          </h2>

          {isLoading ? (
            <Spiner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul> {movieList.map((movie) => (
              <p key={movie.id} className='text-white'>{movie.title}</p>
            ))}</ul>
          )}
        </section>



      </div>
    </main>
  )
}

export default App

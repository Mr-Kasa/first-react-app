import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    genre: '',
    age: '',
    gender: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
      setFormSubmitted(true);
    } else {
      setUserDetails({
        name: '',
        genre: '',
        age: '',
        gender: ''
      });
    }
    getPopularSongs(); // Fetch popular songs initially
    const intervalId = setInterval(() => {
      getPopularSongs(); // Fetch popular songs periodically
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const getPopularSongs = async () => {
    try {
      const response = await axios.get(`https://api.deezer.com/chart`);
      setResults(response.data.tracks.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching popular songs:', error.message);
      setResults([]);
    }
  };

  const genres = ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Electronic', 'Rap'];

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.deezer.com/search`, {
        params: { q: query }
      });
      setResults(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
    }
    setIsLoading(false);
  };

  const handleUserDetailsSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    setFormSubmitted(true);
  };

  const handleUserDetailsChange = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputs = event.target.querySelectorAll('input, select');
    let isAnyEmpty = false;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isAnyEmpty = true;
      }
    });
    if (isAnyEmpty) {
      alert('Please fill in all fields.');
      return;
    }
    handleUserDetailsSubmit(event);
  };

  const isFormReadyToSubmit = () => {
    return Object.values(userDetails).every(value => value.trim() !== '');
  };

  if (!formSubmitted) {
    return (
      <div className="App">
        <h1 className='heading1'><strong>Your Integrated Environment for the Latest Music</strong></h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={userDetails.name} onChange={handleUserDetailsChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id="lastname" name="lastname" value={userDetails.lastname} onChange={handleUserDetailsChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" value={userDetails.age} onChange={handleUserDetailsChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={userDetails.gender} onChange={handleUserDetailsChange} required>
              <option value="">Select Gender</option>
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select id="genre" name="genre" value={userDetails.genre} onChange={handleUserDetailsChange} required>
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <button className='searchButton' type="submit" disabled={!isFormReadyToSubmit()}>Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`App ${formSubmitted ? 'visible' : ''}`}>
      <h1 className='heading1'><strong>Your Integrated Environment for the Latest Music</strong></h1>
      <div className='inputStyler'>
        <div className='searchHeading'><h2 className='searchSong'>Search for any song</h2></div>
        <input
          className='searchArea'
          placeholder='e.g., Drake forever'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className='searchButtons'>
          <button className='searchButton' onClick={handleSearch}>Search</button>
          <button className='searchButton' onClick={() => setQuery('')}>Clear</button>
        </div>
      </div>
      <div className='displayArea' id="displayArea">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {results.map((track) => (
              <li key={track.id}>
                <strong>{track.title}</strong> by {track.artist.name} <br />
                <img src={track.album.cover} alt="Album Art" />
                <div>
                  Album: {track.album.title}<br />
                  Artist: {track.artist.name}<br />
                  <a href={track.link} target="_blank" rel="noopener noreferrer">Listen on Deezer</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='randomSongs'>
        <h2>Songs</h2>
        {results.map((track) => (
          <div className="songCard" key={track.id}>
            <div className="songTitle">{track.title}</div>
            <div className="artistName">{track.artist.name}</div>
            <div className="albumArtDuration">
              <img src={track.album.cover} alt="Album Art" />
              <span>{track.album.title}</span>
              <span>{track.duration}</span>
            </div>
            <a href={track.link} target="_blank" rel="noopener noreferrer">Listen on Deezer</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

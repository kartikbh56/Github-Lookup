import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');

  return (
    <div className="App">
    <Navbar/>
      <SearchBar onChange={setInput} />
      <Data input={input} />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6dMFApzKfQirskhvPqknEBLdQefLj4YXbAw&s' alt='github logo' className='logo'/>
      <h1>Github Lookup</h1>
    </nav>
  );
};

function SearchBar({ onChange }) {
  return (
    <input 
      type="text" 
      className="search-input" 
      placeholder="Search..." 
      onChange={(e) => onChange(e.target.value)} 
    />
  );
}

function Data({ input }) {
  const [data, setData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [debounceTimeout,setDebounceTimeout] = useState(null)
  useEffect(() => {
    if(debounceTimeout){
      clearInterval(debounceTimeout)
    }
    setData([])
    const timeout = setTimeout(()=>{
      if (input.length) {
        setLoadingState(true)
        fetch(`https://api.github.com/search/users?q=${input.split(' ').join('+')}`)
          .then(response => response.json())
          .then(data => {
            setLoadingState(false);
            setData(data.items || []);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setLoadingState(false);
          });
          console.log('requesting')
      }
    },1000)
    setDebounceTimeout(timeout)
    return ()=>{
     clearTimeout(timeout)
    }  
  }, [input]);

  return (
    <>
      {loadingState ? (
        <div className='container'>Loading...</div>
      ) : (
        <div className="container">
          {data.map(profile => (
            <Card key={profile.id} username={profile.login} avatar_url={profile.avatar_url} html_url={profile.html_url} />
          ))}
        </div>
      )}
    </>
  );
}

function Card({ username, avatar_url, html_url }) {
  const [data, setData] = useState(null)
  useEffect(()=>{
    fetch(`https://api.github.com/users/${username}`)
    .then(data=>data.json())
    .then(function({login,followers,following,public_repos}){
      if(login && followers && following && public_repos)
      setData({login,followers,following,public_repos})
      else
      setData(null)
    })  
  },[username])
  return (
    <div className="card">
    <img src={avatar_url} alt={username} className="avatar"/>
    <div className="username">
    <a href={html_url}>
      {username}
    </a>
    </div>
    
    {data && 
    <div className="stats">
        <div className="stat">
            <div className="stat-value">{data?.followers}</div>
            <div className="stat-label">Followers</div>
        </div>
        <div className="stat">
            <div className="stat-value">{data?.following}</div>
            <div className="stat-label">Following</div>
        </div>
        <div className='stat'>
          <div className='stat-value'>{data?.public_repos}</div>
            <div className="stat-label">Repos</div>
        </div>
    </div>
    }
</div>
    
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/check-auth', { withCredentials: true })
      .then(res => {
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          window.location.href = '/';
        }
      });
  }, []);

  const logout = async () => {
    await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
    window.location.href = '/';
  };

  return user ? (
    <div>
      <h1>Welcome {user.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  ) : <p>Loading...</p>;
}

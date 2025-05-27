import React, { useEffect, useState } from 'react';
import axios from 'axios';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 3;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleFilter = () => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const getPaginatedUsers = () => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  };

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="container my-5">
      <h2 className="mb-4">User Dashboard</h2>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="row">
        {getPaginatedUsers().map(user => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {user.email} <br />
                  <strong>Phone:</strong> {user.phone}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default App;

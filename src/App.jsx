import React, { useState, useEffect } from 'react';
import { fetchCharacters } from './api';

const App = () => {
    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await fetchCharacters(page, 250);
                setCharacters(data.results);
                setFilteredCharacters(data.results);
            } catch (err) {
                setError('Failed to fetch characters.');
            } finally {
                setLoading(false);
            }
        };

        loadCharacters();
    }, [page]);

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        const filtered = characters.filter((character) =>
            character.name.toLowerCase().includes(searchValue)
        );
        setFilteredCharacters(filtered);
    };

    const handleSort = (key) => {
        const sorted = [...filteredCharacters].sort((a, b) =>
            a[key].localeCompare(b[key])
        );
        setFilteredCharacters(sorted);
    };

    const handleFilterStatus = (status) => {
        if (status === 'All') {
            setFilteredCharacters(characters);
        } else {
            const filtered = characters.filter((character) => character.status === status);
            setFilteredCharacters(filtered);
        }
        setFilterStatus(status);
    };

    const handleRowClick = (character) => {
        setSelectedCharacter(character);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
    };

    const paginatedCharacters = filteredCharacters.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div className="app">
            <h1>Rick and Morty Characters</h1>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search characters by name..."
                            onChange={handleSearch}
                            className="search-input"
                        />

                        <div className="sort-filter">
                            <label htmlFor="sortSelect">Sort by:</label>
                            <select
                                id="sortSelect"
                                onChange={(e) => handleSort(e.target.value)}
                                className="sort-select"
                            >
                                <option value="name">Name</option>
                                <option value="species">Species</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="controls">
                        <label>
                            Items per page:
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={250}>250</option>
                            </select>
                        </label>
                    </div>

                    <table className="character-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')}>Name</th>
                                <th onClick={() => handleSort('status')}>Status</th>
                                <th onClick={() => handleSort('species')}>Species</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCharacters.map((character) => (
                                <tr
                                    key={character.id}
                                    onClick={() => handleRowClick(character)}
                                    className="character-row"
                                >
                                    <td>{character.name}</td>
                                    <td>{character.status}</td>
                                    <td>{character.species}</td>
                                    <td>
                                        <img
                                            src={character.image}
                                            alt={character.name}
                                            className="character-image"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                            Previous
                        </button>

                        <span>Page {page} of {Math.ceil(filteredCharacters.length / itemsPerPage)}</span>

                        <select
                            value={page}
                            onChange={(e) => setPage(Number(e.target.value))}
                            className="page-select"
                        >
                            {Array.from({ length: Math.ceil(filteredCharacters.length / itemsPerPage) }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(filteredCharacters.length / itemsPerPage)))}
                            disabled={page === Math.ceil(filteredCharacters.length / itemsPerPage)}
                        >
                            Next
                        </button>
                    </div>

                    {selectedCharacter && (
                        <div className="character-details">
                            <h2>Character Details</h2>
                            <p><strong>Name:</strong> {selectedCharacter.name}</p>
                            <p><strong>Status:</strong> {selectedCharacter.status}</p>
                            <p><strong>Species:</strong> {selectedCharacter.species}</p>
                            <img
                                src={selectedCharacter.image}
                                alt={selectedCharacter.name}
                                className="character-detail-image"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default App;

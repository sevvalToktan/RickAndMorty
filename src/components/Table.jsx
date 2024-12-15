import React from 'react';

const Table = ({ data, onRowClick }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Species</th>
                </tr>
            </thead>
            <tbody>
                {data.map((character) => (
                    <tr key={character.id} onClick={() => onRowClick(character)}>
                        <td>{character.name}</td>
                        <td>{character.status}</td>
                        <td>{character.species}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;

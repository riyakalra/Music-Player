import React from "react";
import "./index.css";

export default function SongsList({ songs }) {
    return (
        <div className="song-list-container">
            <table className="song-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artists</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index)=> (
                        <tr key={song.id}>
                        <td>{index + 1}</td>
                        <td className="song-title-cell">
                          <img src={song.image} alt={song.title} className="song-image" />
                          <span className="song-title">{song.title}</span>
                        </td>
                        <td>{song.artists}</td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
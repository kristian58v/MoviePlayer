import React from 'react';
import { Modal } from '@mui/material';

function MoviePlayerModal({ isOpen, onClose, movieId, media_type }) {
    // Use Django proxy URL
    // const proxyUrl = `http://localhost:8000/proxy/?url=https://vidsrc.to/embed/${media_type}/${movieId}`;

    const proxyUrl = `https://vidsrc.to/embed/${media_type}/${movieId}`;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="movie-player-modal"
            aria-describedby="movie-player"
        >
            <div className={"movie-player-container"}>
                <iframe src={proxyUrl}
                        title="Movie Player"
                        style={{ width: '100%', height: '100%' }}
                        // sandbox={"allow-scripts"}
                        allowFullScreen
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true"
                />
            </div>
        </Modal>
    );
}

export default MoviePlayerModal;

import React, {useEffect} from 'react';
import { Modal } from '@mui/material';

import { useApi } from '../util/useApi';
import { usePlayer } from "../context/PlayerContext";

function MoviePlayerModal({ isOpen, onClose, movieId, media_type, title }) {
    // Use Django proxy URL
    // const proxyUrl = `http://localhost:8000/proxy/?url=https://vidsrc.to/embed/${media_type}/${movieId}`;

    const { player } = usePlayer(); // Get the current player

    let proxyUrl;

    if (player === "Player 1") {
        proxyUrl = `https://vidsrc.to/embed/${media_type}/${movieId}`;
    } else {
        proxyUrl = `https://vidsrc.xyz/embed/${media_type}/${movieId}`;
    }
    const makeRequest = useApi();

    const sendWatchedItemRequest = async () => {
        const requestData = {
            movie_series_id: movieId,
            movie_series_title: title,
            media_type: media_type
        };

        const response = await makeRequest('/api/post_watched_item', requestData, 'POST');

        if (response.error) {
            console.error('Error sending watched item:', response.message || response.status);
        } else {
            console.log('Watched item request sent successfully for:', movieId);
        }
    };


    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => {
                sendWatchedItemRequest();
            }, 15000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer); // Clear the timeout if the modal is closed before 10 seconds
            }
        };
    }, [movieId]);


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

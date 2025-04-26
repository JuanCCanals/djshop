import { useEffect, useState, useRef } from "react";
//import "mediaelement/build/mediaelementplayer.min.css";
import "mediaelement/build/mediaelementplayer.css";

import "mediaelement";
import './VideoPlayer.css'

const VideoPlayer = ({ filename }) => {
    const videoRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/generate-video-token/${filename}`);
                const data = await response.json();
                if (data.token) {
                    setVideoSrc(`http://localhost:5000/stream-video/${data.token}`);
                }
            } catch (error) {
                console.error("Error obteniendo el token", error);
            }
        };

        fetchToken();
    }, [filename]);

    useEffect(() => {
      if (videoRef.current && videoSrc) {
          const player = new window.MediaElementPlayer(videoRef.current, {
              features: ["playpause", "progress", "current", "duration", "volume", "fullscreen"], // 🔹 Agregamos controles de audio
              success: (media) => {
                  media.setVolume(1); // 🔊 Asegura que el volumen esté en 100%
                  media.play();
              },
          });
      }
  }, [videoSrc]);

  return videoSrc ? (
    <video
        ref={videoRef}
        width="352"
        height="150"
        controles
        //loop
        //autoPlay
        playsInline
        muted={false} // 🔊 Desactiva el mute
        //controls // 🔹 Activa los controles
    >
        <source src={videoSrc} type="video/mp4" />
    </video>
) : (
    <p>Cargando video...</p>
);
};

export default VideoPlayer;

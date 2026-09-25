import React from "react";
import {
  MapPin,
  Clock,
} from "lucide-react";

const CurrentMatchCard = ({ partido }) => {

  const porcentaje =
    (partido.jugadoresActuales /
      partido.jugadoresMaximos) *
    100;

  const handleVerPartido = () => {
    console.log("Ver partido:", partido);
  };

  return (
    <div className="current-match">

      {/* Imagen */}

      <div className="current-match__image-wrapper">

        <img
          src={partido.imagen}
          alt={partido.titulo}
          className="current-match__image"
        />

        <span className="current-match__badge">
          {partido.fecha}
        </span>

      </div>


      {/* Información */}

      <div className="current-match__info">

        <h3>
          {partido.titulo}
        </h3>

        <div className="current-match__type">

          <span>
            {partido.modalidad}
          </span>

          <span>•</span>

          <span>
            {partido.superficie}
          </span>

        </div>


        <div className="current-match__location">

          <MapPin size={17} />

          <div>

            <strong>
              {partido.lugar}
            </strong>

            <span>
              {partido.ciudad}
            </span>

          </div>

        </div>

      </div>


      {/* Hora */}

      <div className="current-match__time">

        <Clock size={18} />

        <strong>
          {partido.hora}
        </strong>

        <span>
          {partido.fecha}
        </span>

      </div>


      {/* Jugadores */}

      <div className="current-match__players">

        <strong>
          {partido.jugadoresActuales} /{" "}
          {partido.jugadoresMaximos}
        </strong>

        <span>
          Jugadores
        </span>

        <div className="current-match__progress">

          <div
            className="current-match__progress-bar"
            style={{
              width: `${porcentaje}%`,
            }}
          />

        </div>

      </div>


      {/* Botón */}

      <button
        className="home-primary-button current-match__button"
        onClick={handleVerPartido}
      >
        Ver y unirme
      </button>

    </div>
  );
};

export default CurrentMatchCard;
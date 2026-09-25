import React from "react";
import CurrentMatchCard from "./CurrentMatchCard";

const CurrentMatches = () => {

  const partidos = [
    {
      id: 1,
      titulo: "Partido nocturno",
      fecha: "Hoy",
      hora: "20:00",
      modalidad: "6 vs 6",
      superficie: "Sintético",
      lugar: "Tercer Tiempo",
      ciudad: "Posadas, Misiones, Argentina",
      jugadoresActuales: 8,
      jugadoresMaximos: 14,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcDtxvTMJ6NCE1_XskVvKl0zIg9W-KXV9_eCDwdvqyjs8N2uhgaHSHgGr5&s=10",
      destacado: true,
    },
    {
      id: 2,
      titulo: "Fútbol del sábado",
      fecha: "Mañana",
      hora: "17:00",
      modalidad: "11 vs 11",
      superficie: "Césped",
      lugar: "Club Atletico Bartolomé Mitre",
      ciudad: "Posadas, Misiones, Argentina",
      jugadoresActuales: 10,
      jugadoresMaximos: 15,
      imagen:
        "https://estadiosdeargentina.com.ar/wp-content/uploads/2014/09/bmitreposadas1-1.png",
      destacado: false,
    },
    {
      id: 3,
      titulo: "Fútbol Mañanero",
      fecha: "Dom 18 May",
      hora: "10:00",
      modalidad: "6 vs 6",
      superficie: "Sintético",
      lugar: "Crucero del Norte",
      ciudad: "Garupá, Misiones, Argentina",
      jugadoresActuales: 5,
      jugadoresMaximos: 13,
      imagen:
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80",
      destacado: false,
    },
  ];

  return (
    <section className="home-section">

      <div className="home-section__header">

        <h2>
          Partidos Por Jugar
        </h2>

        <button className="home-link-button">
          Ver todos
        </button>

      </div>

      <div className="current-matches">

        {partidos.map((partido) => (
          <CurrentMatchCard
            key={partido.id}
            partido={partido}
          />
        ))}

      </div>

    </section>
  );
};

export default CurrentMatches;
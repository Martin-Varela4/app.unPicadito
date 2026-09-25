import React from "react";
import {
  UserPlus,
} from "lucide-react";

const Conections = () => {

  const conexiones = [
    {
      id: 1,
      nombre: "Luis Ramírez",
      conexiones: 12,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      nombre: "Martín López",
      conexiones: 8,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      nombre: "Pablo Díaz",
      conexiones: 15,
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    },
  ];

  const handleConectar = (conexion) => {
    console.log("Conectar con:", conexion);
  };

  return (
    <section className="home-section">

      <div className="home-section__header">

        <h2>
          Conexiones sugeridas
        </h2>

        <button className="home-link-button">
          Ver todas
        </button>

      </div>


      <div className="home-suggestions">

        {conexiones.map((conexion) => (

          <div
            className="home-suggestion"
            key={conexion.id}
          >

            <img
              src={conexion.avatar}
              alt={conexion.nombre}
              className="home-suggestion__avatar"
            />

            <div className="home-suggestion__info">

              <strong>
                {conexion.nombre}
              </strong>

              <span>
                {conexion.conexiones} conexiones en común
              </span>

            </div>


            <button
              className="home-suggestion__button"
              onClick={() => handleConectar(conexion)}
            >

              <UserPlus size={15} />

              Conectar

            </button>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Conections;
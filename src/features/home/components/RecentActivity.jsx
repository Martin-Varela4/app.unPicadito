import React from "react";
import {
  CalendarDays,
  Users,
  Trophy,
  Activity,
} from "lucide-react";

const RecentActivity = () => {

  const actividades = [
    {
      id: 1,
      nombre: "Ana Fernández",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      texto: "se unió al partido",
      detalle: "Fútbol del sábado",
      tiempo: "Hace 2 horas",
      icono: CalendarDays,
    },
    {
      id: 2,
      nombre: "Diego Ruiz",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      texto: "aceptó tu solicitud",
      detalle: "Ahora son conexiones",
      tiempo: "Hace 4 horas",
      icono: Users,
    },
    {
      id: 3,
      nombre: "Pablo Díaz",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      texto: "Ganaste el partido con tu equipo",
      detalle: "Los Imparables",
      tiempo: "Ayer",
      icono: Trophy,
    },
  ];

  return (
    <section className="home-section">

      <div className="home-section__header">

        <h2>
          Actividad reciente
        </h2>

        <Activity size={20} />

      </div>


      <div className="home-activity-list">

        {actividades.map((actividad) => {

          const Icon = actividad.icono;

          return (
            <div
              className="home-activity"
              key={actividad.id}
            >

              <img
                src={actividad.avatar}
                alt={actividad.nombre}
                className="home-activity__avatar"
              />

              <div className="home-activity__content">

                <p>
                  <strong>
                    {actividad.nombre}
                  </strong>{" "}
                  {actividad.texto}
                </p>

                <span>
                  {actividad.detalle}
                </span>

                <small>
                  {actividad.tiempo}
                </small>

              </div>

              <div className="home-activity__icon">
                <Icon size={18} />
              </div>

            </div>
          );
        })}

      </div>


      <button className="home-link-button home-activity__more">
        Ver toda la actividad
      </button>

    </section>
  );
};

export default RecentActivity;
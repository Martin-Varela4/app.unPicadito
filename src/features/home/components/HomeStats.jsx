import React from "react";
import {
  Goal,
  Trophy,
  Users,
  Footprints,
} from "lucide-react";

const HomeStats = () => {

  const stats = [
    {
      id: 1,
      valor: 84,
      descripcion: "Partidos jugados",
      icon: Goal,
    },
    {
      id: 2,
      valor: 52,
      descripcion: "Victorias",
      icon: Trophy,
    },
    {
      id: 3,
      valor: 156,
      descripcion: "Conexiones",
      icon: Users,
    },
    {
      id: 4,
      valor: "Delantero",
      descripcion: "Posición favorita",
      icon: Footprints,
    },
  ];

  return (
    <section className="home-stats">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (
          <div
            className="home-stat-card"
            key={stat.id}
          >

            <div className="home-stat-card__icon">
              <Icon size={28} />
            </div>

            <strong
              className={
                typeof stat.valor === "string"
                  ? "home-stat-card__position"
                  : ""
              }
            >
              {stat.valor}
            </strong>

            <span>
              {stat.descripcion}
            </span>

          </div>
        );
      })}

    </section>
  );
};

export default HomeStats;
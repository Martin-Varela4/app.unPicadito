import React from "react";

const WelcomeBanner = () => {
  return (
    <section className="home-welcome">

      <div>
        <h1>
            {/* una vez conectado con la bd se procede a usar el fetch */}
          Hola Antonio
        </h1>

        <p>
          Como dijo Maradona: "A Jugar"
        </p>
      </div>

    </section>
  );
};

export default WelcomeBanner;
import React from "react";

import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/Footer";

import Conections from "../../../components/Conections";

import WelcomeBanner from "../components/WelcomeBanner";
import HomeStats from "../components/HomeStats";
import CurrentMatches from "../components/CurrentMatches";
import RecentActivity from "../components/RecentActivity";

const HomePage = () => {
  return (
    <div className="home-page">

        <Navbar />

        <Sidebar />

        <main className="home-content">

          <WelcomeBanner />

          <HomeStats />

          <section className="home-section home-match-search">


            <div className="home-match-search-content">

                <div className="home-match-search-info">
                    <h2> Busca una sala para jugar </h2>

                    <p> Ingresa a una sala para empezar. </p>
                </div>

                <a href="/partidos" className="home-match-search-button">
                    Buscar sala
                </a>


            </div>
          </section>

            <CurrentMatches />

            <div className="home-two-columns">
                <div className="home-column">
                
                <RecentActivity />

                <Conections />
                
                </div>

            </div>
        </main>


      <Footer />

    </div>
  );
};

export default HomePage;
import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroimage from "../../images/hero.png";
import image1 from "../../images/image1.png";
import quiz from "../../images/quiz.png";
import communite from "../../images/communite-en-ligne.png";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Bienvenue sur EduHub</h1>
          <p className="slogan">Apprenez. Progressez. Réussissez.</p>
          <div className="hero-buttons">
            <Button
              variant="primary"
              className="hero-btn"
              onClick={() => navigate("/cours")}
            >
              Découvrir les Cours
            </Button>
            <Button
              variant="outline-light"
              className="hero-btn"
              onClick={() => navigate("/register")}
            >
              S'inscrire
            </Button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={heroimage}
            alt="Learning illustration"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <Card className="feature-card">
          <Card.Img
            variant="top"
            src={image1}
          />
          <Card.Body>
            <Card.Title>Contenu Interactif</Card.Title>
            <Card.Text>
              Apprenez à votre rythme avec des cours interactifs et engageants.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="feature-card">
          <Card.Img
            variant="top"
            src={quiz}
          />
          <Card.Body>
            <Card.Title>Quiz & Évaluations</Card.Title>
            <Card.Text>
              Testez vos connaissances et suivez vos progrès facilement.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="feature-card">
          <Card.Img
            variant="top"
            src={communite}
          />
          <Card.Body>
            <Card.Title>Communauté Active</Card.Title>
            <Card.Text>
              Rejoignez une communauté d'apprenants motivés et passionnés.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;

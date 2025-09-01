import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form, Row, Col } from "react-bootstrap";
import { createQuiz } from "../../JS/Actions/quiz";
import "./AddQuiz.css";

const AddQuiz = () => {
  const { courseId, lessonId } = useParams(); // récupère les IDs du cours et de la leçon
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // État local pour gérer les questions du quiz
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", ""], correctAnswer: "" } // on commence avec une question par défaut
  ]);

  // Mise à jour du texte de la question
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // Mise à jour des options d'une question
  const handleOptionChange = (qIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  // Définir la réponse correcte pour une question
  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", ""], correctAnswer: "" }]);
  };

  // Supprimer une question existante
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Soumission du formulaire pour créer le quiz
  const handleSubmit = (e) => {
    e.preventDefault();
    const quizData = { lessonId, questions }; // on prépare les données pour l'action Redux
    dispatch(createQuiz(quizData)).then(() => navigate(`/course/${courseId}/lessons`));
  };

  return (
    <div className="add-quiz-page">
      <div className="add-quiz-container">
        <h2>Créer un quiz </h2>
        <Form onSubmit={handleSubmit}>
          {/* Parcours de toutes les questions */}
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <Form.Group className="mb-5">
                <Form.Label>Question {qIndex + 1}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Texte de la question"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  required
                  className="input-field"
                />
              </Form.Group>

              {/* Parcours des options de la question */}
              {question.options.map((opt, oIndex) => (
                <Form.Group as={Row} className="mb-4 option-group" key={oIndex}>
                  <Form.Label column sm="1" className="option-label">
                    {oIndex + 1}
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                      className="input-field option-input"
                    />
                  </Col>
                  <Col sm="3" className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name={`correctAnswer-${qIndex}`} // radio group par question
                      label="Réponse correcte"
                      checked={question.correctAnswer === opt}
                      onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                      required
                      className="custom-radio"
                    />
                  </Col>
                </Form.Group>
              ))}

              {/* Bouton pour supprimer la question */}
              {questions.length > 1 && (
                <Button variant="danger" size="sm" onClick={() => removeQuestion(qIndex)} className="mb-4">
                  Supprimer la question
                </Button>
              )}
            </div>
          ))}

          {/* Boutons pour ajouter une question, soumettre ou annuler */}
          <div className="buttons-group">
            <Button variant="secondary" onClick={addQuestion}>
              Ajouter une question
            </Button>
            <Button type="submit" variant="primary">
              Créer le quiz
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Annuler
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddQuiz;

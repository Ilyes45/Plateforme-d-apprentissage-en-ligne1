import React, { useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Form, Row, Col } from "react-bootstrap";
import { createQuiz } from "../../JS/Actions/quiz";

const AddQuiz = () => {
  const { courseId,lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", ""], correctAnswer: "" }
  ]);


  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", ""], correctAnswer: "" }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };


const handleSubmit = (e) => {
  e.preventDefault();
  const quizData = {
    lessonId,
    questions
  };
  dispatch(createQuiz(quizData))
    .then(() => {
      navigate(`/course/${courseId}/lessons`); // retour à la liste des leçons
    });
};

  return (
    <div className="container mt-4">
      <h2>Créer un quiz pour la leçon {lessonId}</h2>
      <Form onSubmit={handleSubmit}>
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            style={{ marginBottom: "2rem", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Question {qIndex + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Texte de la question"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
              />
            </Form.Group>

            {question.options.map((opt, oIndex) => (
              <Form.Group as={Row} className="mb-2" key={oIndex} controlId={`option-${qIndex}-${oIndex}`}>
                <Form.Label column sm="2">Option {oIndex + 1}</Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                </Col>
                <Col sm="2" className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    name={`correctAnswer-${qIndex}`}
                    label="Réponse correcte"
                    checked={question.correctAnswer === opt}
                    onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                    required
                  />
                </Col>
              </Form.Group>
            ))}

            {questions.length > 1 && (
              <Button variant="danger" size="sm" onClick={() => removeQuestion(qIndex)}>
                Supprimer la question
              </Button>
            )}
          </div>
        ))}

        <Button variant="secondary" onClick={addQuestion} className="mb-3">
          Ajouter une question
        </Button>
        <br />
        <Button type="submit" variant="primary">
  Créer le quiz
</Button>
      </Form>
    </div>
  );
};

export default AddQuiz;

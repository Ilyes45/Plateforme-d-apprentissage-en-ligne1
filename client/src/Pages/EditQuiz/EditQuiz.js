import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, editQuiz } from "../../JS/Actions/quiz";
import './EditQuiz.css';

const EditQuiz = () => {
  const { id } = useParams(); // Récupère l'ID du quiz depuis l'URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook pour navigation

  // Récupère le quiz et l'état de chargement depuis Redux
  const { quizToGet, load } = useSelector((state) => state.quizReducer);

  // État local pour le formulaire de modification
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessonId: "",
    questions: [],
  });

  // Charger le quiz depuis le store lors du montage du composant
  useEffect(() => {
    dispatch(getQuiz(id));
  }, [dispatch, id]);

  // Une fois le quiz récupéré, on remplit le formulaire
  useEffect(() => {
    if (quizToGet) {
      setFormData({
        title: quizToGet.title || "",
        description: quizToGet.description || "",
        lessonId: quizToGet.lessonId || "",
        questions: quizToGet.questions || [],
      });
    }
  }, [quizToGet]);

  // Gérer la modification d'une question (texte ou réponse correcte)
  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Gérer la modification d'une option
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  // Supprimer une question
  const removeQuestion = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(qIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Ajouter une option à une question
  const addOption = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Supprimer une option
  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Envoi du formulaire : modification du quiz
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editQuiz(id, formData)); // Appel action Redux
    navigate(-1); // Retour à la page précédente
  };

  // Affichage pendant le chargement
  if (load) return <p>Chargement du quiz...</p>;
  if (!quizToGet) return <p>Quiz introuvable</p>;

  return (
    <div className="edit-quiz-container">
      <h2>Modifier le Quiz</h2>
      <form onSubmit={handleSubmit}>

        <h4>Questions</h4>
        {formData.questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-3 mb-3 question-card">

            {/* Texte de la question */}
            <div className="mb-2">
              <label>Question</label>
              <input
                type="text"
                className="form-control"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionText", e.target.value)
                }
              />
            </div>

            {/* Options */}
            <div className="mb-2">
              <label>Options</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="d-flex mb-1">
                  <input
                    type="text"
                    className="form-control"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-danger ms-1"
                    onClick={() => removeOption(qIndex, optIndex)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mt-1"
                onClick={() => addOption(qIndex)}
              >
                ➕ Ajouter une option
              </button>
            </div>

            {/* Réponse correcte */}
            <div className="mb-2">
              <label>Réponse correcte</label>
              <select
                className="form-select"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                }
              >
                <option value="">Sélectionner la réponse correcte</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt || `Option ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton pour supprimer la question */}
            <button
              type="button"
              className="btn btn-danger mt-2"
              onClick={() => removeQuestion(qIndex)}
            >
              Supprimer cette question
            </button>
          </div>
        ))}

        {/* Ajouter une nouvelle question */}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addQuestion}
        >
          ➕ Ajouter une question
        </button>

        {/* Boutons Enregistrer et Annuler */}
        <div className="buttons-group">
          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuiz;

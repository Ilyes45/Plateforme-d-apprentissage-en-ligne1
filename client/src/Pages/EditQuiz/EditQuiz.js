import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getQuiz, editQuiz } from "../../JS/Actions/quiz";

const EditQuiz = () => {
  const { id } = useParams(); // ID du quiz
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { quizToGet, load } = useSelector((state) => state.quizReducer);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessonId: "",
    questions: [],
  });

  // Charger le quiz à éditer
  useEffect(() => {
    dispatch(getQuiz(id));
  }, [dispatch, id]);

  // Remplir le formulaire quand on reçoit le quiz
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

  
  // Gestion des changements dans les questions
  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Gestion des options
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  const removeQuestion = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(qIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Soumettre les modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editQuiz(id, formData));
    navigate(-1); // Retour à la page précédente
  };

  if (load) return <p>Chargement du quiz...</p>;
  if (!quizToGet) return <p>Quiz introuvable</p>;

  return (
    <div className="container mt-4">
      <h2>Modifier le Quiz</h2>
      <form onSubmit={handleSubmit}>
       

        <h4>Questions</h4>
        {formData.questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-3 mb-3">
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

            <div className="mb-2">
              <label>Options</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="d-flex mb-1">
                  <input
                    type="text"
                    className="form-control"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
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

            <button
              type="button"
              className="btn btn-danger mt-2"
              onClick={() => removeQuestion(qIndex)}
            >
              Supprimer cette question
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-3" onClick={addQuestion}>
          ➕ Ajouter une question
        </button>

        <button type="submit" className="btn btn-primary">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;

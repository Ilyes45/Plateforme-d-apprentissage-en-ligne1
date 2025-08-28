import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, assignCourse, unassignCourse } from "../../JS/Actions/course";
import { getAllUsers } from "../../JS/Actions/user";
import "./AdminCourseList.css";

const AdminCourseList = () => {
  const dispatch = useDispatch();
  const listCourses = useSelector(state => state.courseReducer.listCourses);
  const users = useSelector(state => state.userReducer.allUsers);

  const [selectedUsers, setSelectedUsers] = useState({});

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleAssign = (courseId) => {
    const userId = selectedUsers[courseId];
    if (!userId) return alert("Sélectionnez un utilisateur !");
    dispatch(assignCourse(courseId, userId));
    setSelectedUsers({ ...selectedUsers, [courseId]: "" });
  };

  const handleUnassign = (courseId, userId) => {
    if (!userId) return;
    dispatch(unassignCourse(courseId, userId));
  };

  return (
    <div className="admin-course-list">
      <h2>📚 Liste des cours (Admin)</h2>

      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Créé par</th>
            <th>Assigné à</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listCourses && listCourses.length > 0 ? (
            listCourses.map(course => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.category}</td>
                <td>{course.createdBy?.name || "N/A"}</td>
                <td>
                  {course.assignedTo?.length > 0 ? (
                    <ul>
                      {course.assignedTo.map(u => (
                        <li key={u._id}>
                          {u.name} ({u.email})
                          <button className="unassign-btn" onClick={() => handleUnassign(course._id, u._id)}>
                            Unassign
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Aucun utilisateur assigné</span>
                  )}
                </td>
                <td>
                  <select
                    value={selectedUsers[course._id] || ""}
                    onChange={(e) =>
                      setSelectedUsers({ ...selectedUsers, [course._id]: e.target.value })
                    }
                  >
                    <option value="">-- Choisir un utilisateur --</option>
                    {users?.map(u => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleAssign(course._id)}>Assigner</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Aucun cours trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCourseList;

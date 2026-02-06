import { useEffect, useState } from "react";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { QuizFromList } from "../../types/quiz/QuizFromList";
import { useAuth } from "../../hooks/UseAuthHook";
import type { IAdminAPIService } from "../../api_services/admin_api/IAdminAPIService";

interface QuizzesTableProps {
  quizApi: IQuizAPIService;
  adminApi: IAdminAPIService;
}

export default function ApprovedQuizzesTable({ quizApi, adminApi }: QuizzesTableProps) {
  const [quizzes, setQuizzes] = useState<QuizFromList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await quizApi.getAllQuizzes(token!);
        if (res.success && res.data) {
          setQuizzes(res.data);
        } else {
          setError(res.message);
        }
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [quizApi, token]);

  const handleCheckboxChange = (quizId: string) => {
    setSelectedQuizzes((prev) =>
      prev.includes(quizId) ? prev.filter((id) => id !== quizId) : [...prev, quizId]
    );
  };

  const handleGenerateReport = async () => {
    if (!token) return;

    if (selectedQuizzes.length === 0) {
      alert("Please select at least one quiz to generate a report.");
      return;
    }

    try {
      const quizIdsAsNumbers = selectedQuizzes.map((id) => parseInt(id, 10));
      const res = await adminApi.generateReport(token, quizIdsAsNumbers);

      if (res.success) {
        alert("Report generated successfully, check your email!");
        setSelectedQuizzes([]);
      } else {
        alert("Failed to generate report: " + res.message);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error generating report: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!token) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmDelete) return;

    try {
      const res = await quizApi.deleteQuiz(parseInt(quizId, 10), token);

      if (res.success) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        setSelectedQuizzes((prev) => prev.filter((id) => id !== quizId));
      } else {
        alert(res.message || "Delete failed");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error deleting quiz");
    }
  };

  if (loading) return <p className="text-gray-500">Loading quizzes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
        
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Author Email</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Duration (s)</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Report</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Delete</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {quizzes.map((quiz, idx) => (
            <tr
              key={quiz.id}
              className={`
                ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} 
                hover:bg-gray-100 transition-colors duration-200
              `}
            >
              <td className="px-6 py-4 text-gray-500">{quiz.id}</td>
              <td className="px-6 py-4 font-medium text-gray-700">{quiz.title}</td>
              <td className="px-6 py-4 text-gray-600">{quiz.author_email}</td>
              <td className="px-6 py-4 text-gray-500">{quiz.duration_seconds}</td>
              <td className="px-6 py-4 text-gray-500">{quiz.created_at}</td>

              <td className="px-6 py-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedQuizzes.includes(quiz.id)}
                  onChange={() => handleCheckboxChange(quiz.id)}
                  className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleGenerateReport}
        className="
          mt-4 px-6 py-2 
          bg-blue-500 font-medium 
          rounded-lg shadow hover:bg-blue-600 
          transition-colors duration-200 
          flex items-center justify-center
          disabled:bg-gray-400 disabled:cursor-not-allowed
        "
        disabled={selectedQuizzes.length === 0}
      >
        Generate Report
      </button>
    </div>
  );
}

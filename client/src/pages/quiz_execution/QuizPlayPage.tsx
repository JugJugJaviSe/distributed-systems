import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { IQuizExecutionAPIService } from "../../api_services/quiz_execution_api/IQuizExecutionAPIService";
import type { GetQuizResponseData } from "../../types/quiz/GetQuizResponses";
import { QuizInfo } from "../../components/quiz_execution/QuizInfo";
import { StartQuizButton } from "../../components/quiz_execution/StartQuizButton";
import { QuizProgress } from "../../components/quiz_execution/QuizProgress";
import { QuizQuestionCard } from "../../components/quiz_execution/QuizQuestionCard";
import { useAuth } from "../../hooks/UseAuthHook";
import { QuizTimer } from "../../components/quiz_execution/QuizTimer";
import { Navbar } from "../../components/navbar/Navbar";


interface QuizPlayPageProps {
    quizApi: IQuizAPIService;
    executionApi: IQuizExecutionAPIService;
}

export function QuizPlayPage({ quizApi, executionApi }: QuizPlayPageProps) {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState<GetQuizResponseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [attemptId, setAttemptId] = useState<number | null>(null);
    const [quizStarted, setQuizStarted] = useState(false);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answersSelected, setAnswersSelected] = useState<Record<number, number>>({});

    const { token, user } = useAuth();

    // Load quiz data
    useEffect(() => {
        const loadQuiz = async () => {
            setLoading(true);
            setError("");
            try {
                if (!quizId) throw new Error("Quiz ID is missing");
                const response = await quizApi.getQuiz(token!, Number(quizId));
                if (response.success && response.data) {
                    setQuizData(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load quiz");
            } finally {
                setLoading(false);
            }
        };
        loadQuiz();
    }, [quizId, quizApi, token]);

    // Start quiz
    const startQuiz = async () => {
        console.log("QUIZ DATA:", quizData);
        if (!quizData) return;
        const response = await executionApi.startQuiz(token!, quizData.quiz_id);
        if (response.success && response.data) {
            setAttemptId(response.data.attempt_id);
            setQuizStarted(true);
            setCurrentQuestionIndex(0);
        } else {
            throw new Error(response.message);
        }
    };

    // Submit answer
    const submitAnswer = async (answerId: number) => {
        if (!attemptId || !quizData) return;

        const currentQuestion = quizData.questions[currentQuestionIndex];

        setAnswersSelected(prev => ({   // Updating UI before calling API for better UX
            ...prev,
            [currentQuestion.question_id]: answerId,
        }));

        if (currentQuestionIndex + 1 < quizData.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
        }

        try {
            const response = await executionApi.submitAnswer(token!, attemptId, currentQuestion.question_id, answerId);

            if (!response.success) {
                console.error(response.message);
            }
        } catch (err) {
            console.error("Submit answer failed", err);
        }

        if (currentQuestionIndex + 1 === quizData.questions.length) {
            await finishQuiz();
        }
    };

    // Finish quiz
    const finishQuiz = () => {
        if (!attemptId || !token) return;

        executionApi.finishQuiz(token, attemptId)   // Not awaiting - user can continue normally
            .catch(err => {
                console.error("Finish quiz failed", err);
            });

        alert("Quiz finished. Results will be sent to your email.");
        navigate(`/${user?.role}-dashboard`);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
                Loading quiz...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
                {error}
            </div>
        );
    }

    if (!quizData) {
        return null;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900">
            <Navbar />
            <QuizInfo
                title={quizData.title}
                durationSeconds={quizData.duration_seconds}
                totalQuestions={quizData.questions.length}
            />

            {!quizStarted ? (
                <StartQuizButton onStart={startQuiz} />
            ) : (
                <>
                    <QuizTimer
                        durationSeconds={quizData.duration_seconds}
                        onTimeUp={finishQuiz}
                    />

                    <QuizProgress
                        answered={Object.keys(answersSelected).length}
                        total={quizData.questions.length}
                    />

                    <QuizQuestionCard
                        question={quizData.questions[currentQuestionIndex]}
                        selectedAnswerId={answersSelected[quizData.questions[currentQuestionIndex].question_id]}
                        onAnswerSelect={submitAnswer}
                    />
                </>
            )}
        </div>
    );
}
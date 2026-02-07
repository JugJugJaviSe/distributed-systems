import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Navbar } from "../../components/navbar/Navbar";
import { CreateQuizForm } from "../../components/quiz/CreateQuizForm";
import type { CreateQuizPageProps } from "../../types/quiz/CreateQuizPageProps";

export default function CreateQuizPage({ quizApi }: CreateQuizPageProps) {
    return (
        <DashboardLayout navbar={<Navbar />}>
            <div className="w-full max-w-5xl px-6 flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-100">Create Quiz</h1>
            </div>

            <div className="w-full max-w-5xl px-6">
                <CreateQuizForm quizApi={quizApi} />
            </div>
        </DashboardLayout>
    );
}

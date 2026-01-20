import { CreateQuizForm } from "../../components/quiz/CreateQuizForm";
import type { CreateQuizPageProps } from "../../types/quiz/CreateQuizPageProps";

export default function CreateQuizPage({ quizApi }: CreateQuizPageProps) {
    return (
        <main className="p-6">
            <CreateQuizForm quizApi={quizApi} />
        </main>
    );
}

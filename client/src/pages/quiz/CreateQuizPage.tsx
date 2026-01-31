import { Navbar } from "../../components/navbar/Navbar";
import { CreateQuizForm } from "../../components/quiz/CreateQuizForm";
import type { CreateQuizPageProps } from "../../types/quiz/CreateQuizPageProps";

export default function CreateQuizPage({ quizApi }: CreateQuizPageProps) {
    return (
        <main>
            <Navbar />
            <CreateQuizForm quizApi={quizApi} />
        </main>
    );
}

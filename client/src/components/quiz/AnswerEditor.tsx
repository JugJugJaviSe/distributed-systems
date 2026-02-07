interface Props {
    answer: { text: string; is_correct: boolean };
    onChange: (a: { text: string; is_correct: boolean }) => void;
}

export function AnswerEditor({ answer, onChange }: Props) {
    return (
        <div className="flex items-center gap-3">
            <input
                value={answer.text}
                onChange={(e) => onChange({ ...answer, text: e.target.value })}
                placeholder="Enter answer text"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="flex items-center gap-2 text-gray-300 text-sm select-none">
                <input
                    type="checkbox"
                    checked={answer.is_correct}
                    onChange={(e) => onChange({ ...answer, is_correct: e.target.checked })}
                    className="h-5 w-5 rounded-md text-indigo-500 bg-gray-800 border-gray-700 focus:ring-2 focus:ring-indigo-500"
                />
                Correct
            </label>
        </div>
    );
}

interface Props {
    answer: { text: string; is_correct: boolean };
    onChange: (a: { text: string; is_correct: boolean }) => void;
}

export function AnswerEditor({ answer, onChange }: Props) {
    return (
        <div className="flex gap-2 items-center">
            <input
                value={answer.text}
                onChange={e => onChange({ ...answer, text: e.target.value })}
                placeholder="Answer"
                className="flex-1 p-2 border rounded"
            />

            <input
                type="checkbox"
                checked={answer.is_correct}
                onChange={e =>
                    onChange({ ...answer, is_correct: e.target.checked })
                }
            />
        </div>
    );
}

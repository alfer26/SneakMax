import styles from './index.module.scss';
import Cross from '../../../assets/Cross';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
    question: string;
    className: string;
    stylesCustom?: CSSModuleClasses;
    children: ReactNode;
};

const QuestionAnswer: FC<Props> = ({ question, className, stylesCustom, children }) => {
    const [answerDisplay, setAnswerDisplay] = useState(false);
    const [answerHeight, setAnswerHeight] = useState(0);
    const answerRef = useRef<HTMLParagraphElement | null>(null);
    useEffect(() => {
        if (!answerRef.current) return;
        const observer = new ResizeObserver(() => {
            if (!answerRef.current) return;
            setAnswerHeight(answerRef.current.scrollHeight);
        });
        observer.observe(answerRef.current);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={`${styles.questionAnswer}`}>
            <div className={styles.question}>
                <h3>{question}</h3>
                <button onClick={() => setAnswerDisplay(!answerDisplay)} aria-label="Показать/Скрыть ответ">
                    <Cross
                        fill={'black'}
                        style={{ rotate: answerDisplay ? `0deg` : '135deg', scale: answerDisplay ? `1` : '0.9' }}
                    />
                </button>
            </div>
            <div
                className={styles.answer}
                style={{ maxHeight: answerDisplay ? `${answerHeight}px` : '0px' }}
                ref={answerRef}
            >
                <div className={stylesCustom && stylesCustom[className]}>{children}</div>
            </div>
        </div>
    );
};

export default QuestionAnswer;

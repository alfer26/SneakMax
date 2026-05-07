import styles from './index.module.scss';
import instagram from '../../assets/ask/instagram.png';
import collage from '../../assets/ask/collage.png';
import { initial } from '../../axios/initial';
import { useRef, useState } from 'react';

const Ask = () => {
    const [responseOpacity, setResponseOpacity] = useState(0);
    const [responseZIndex, setResponseZIndex] = useState(-1);
    const [response, setResponse] = useState('');
    const formRef = useRef<null | HTMLFormElement>(null);
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await initial.post('questions', {
                name: formData.get('name'),
                phoneNumber: formData.get('phoneNumber'),
            });
            setResponse('Ждите ответа! :)');
            setResponseOpacity(1);
            setResponseZIndex(1);
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.reset();
                }
            }, 1000);
        } catch (error) {
            console.error(error);
            setResponse('Какая-то ошибка... :(');
            setResponseOpacity(1);
            setResponseZIndex(1);
        }
        setTimeout(() => setResponseOpacity(0), 2000);
        setTimeout(() => setResponseZIndex(-1), 2700);
    }
    return (
        <section className={styles.ask} id="ask">
            <form onSubmit={handleSubmit} ref={formRef}>
                <h2>Есть вопросы?</h2>
                <p>Заполните форму и наш менеджер свяжется с вами</p>
                <div className={styles.form}>
                    <input type="text" placeholder="Ваше имя" name="name" required />
                    <input type="tel" placeholder="Номер телефона" name="phoneNumber" required />
                    <button className={`redButton`} type="submit">
                        Отправить
                    </button>
                </div>
                <div className={styles.response} style={{ opacity: responseOpacity, zIndex: responseZIndex }}>
                    <h2>{response}</h2>
                </div>
            </form>
            <div>
                <img className={styles.instagram} src={instagram} alt="Инстаграм" />
                <img className={styles.collage} src={collage} alt="Коллаж" />
            </div>
        </section>
    );
};

export default Ask;

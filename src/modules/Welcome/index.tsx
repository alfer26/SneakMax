import styles from './index.module.scss';

const Welcome = () => {
    return (
        <section className={styles.welcome}>
            <div>
                <h1>Кроссовки известных брендов с доставкой по России и СНГ</h1>
                <p>Мы продаем кроссовки брендов Nike, Adidas, Puma, Reebok, Converse и многие другие по низким ценам</p>
                <button className="redButton" onClick={() => document.getElementById('catalog')!.scrollIntoView()}>
                    Перейти к покупкам
                </button>
            </div>
        </section>
    );
};

export default Welcome;

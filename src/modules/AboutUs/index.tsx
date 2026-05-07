import styles from './index.module.scss';
import image from './../../assets/aboutUs/image.png';

const AboutUs = () => {
    return (
        <section className={styles.aboutUs} id="aboutUs">
            <div>
                <h2>Пара слов о нас</h2>
                <p>
                    Спорт держит нас в форме. Учит дисциплине. Объединяет нас. Через спорт мы можем менять жизни. В том
                    числе с помощью воодушевляющих историй спортсменов. Чтобы помочь тебе подняться и двигаться вперед.
                </p>
                <div>
                    <div></div>
                    <p>SneakMax</p>
                </div>
                <img src={image} alt="Фото на заднем фоне" />
            </div>
        </section>
    );
};

export default AboutUs;

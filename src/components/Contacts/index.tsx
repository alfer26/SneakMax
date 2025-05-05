import styles from './index.module.scss';
import vk from '../../assets/contacts/vk.svg';
import instagram from '../../assets/contacts/instagram.svg';

const Contacts = () => {
    return (
        <section className={styles.contacts} id="contacts">
            <h2>Контакты</h2>
            <div className={styles.main}>
                <div className={styles.departments}>
                    <div>
                        <div className={styles.title}>
                            <h3>ГЛАВНЫЙ ОФИС</h3>
                            <div className={styles.help}>?</div>
                        </div>
                        <div>
                            <a target="_blank" href="tel:+7 800 789 89 89" className={styles.phoneNumber}>
                                +7 800 789 89 89
                            </a>
                            <a target="_blank" href="https://yandex.ru/maps/-/CHei4YN4">
                                г. Санкт-Петербург, улица Комсомола, 43
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3>ОТДЕЛ ПРОДАЖ</h3>
                        <div>
                            <a target="_blank" href="tel:+7 800 789 89 89" className={styles.phoneNumber}>
                                +7 800 789 89 89
                            </a>
                            <a target="_blank" href="https://yandex.ru/maps/-/CHei4YN4">
                                г. Санкт-Петербург, улица Комсомола, 43
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.socialNetworks}>
                    <a target="_blank" href="https://vk.com/">
                        <img src={vk} alt="Вконтакте" />
                    </a>
                    <a target="_blank" href="https://www.instagram.com">
                        <img src={instagram} alt="Инстаграм" />
                    </a>
                </div>
            </div>
            <iframe
                title="Местоплоложение на карте"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A65da93afb21d08f1be2ae3f8d084c4fc72ac6515f05c34da321d5e2687871f05&amp;source=constructor"
                width="100%"
            ></iframe>
        </section>
    );
};

export default Contacts;

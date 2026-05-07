import Filter from './components/Filter';
import Main from './components/Main';
import styles from './index.module.scss';

const Catalog = () => {
    return (
        <section className={styles.catalog} id='catalog'>
            <h2>Каталог</h2>
            <div>
                <Filter />
                <Main />
            </div>
        </section>
    );
};

export default Catalog;

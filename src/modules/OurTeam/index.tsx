import styles from './index.module.scss';
import { useEffect } from 'react';
import { TeamReducer } from '../../Types';
import { useSelector } from 'react-redux';
import { getTeam } from '../../redux/asyncThunks/getTeam';
import { useAppDispatch } from '../../hooks/useAppDispatch';

const OurTeam = () => {
    const appDispatch = useAppDispatch();
    const data = useSelector((reducer: TeamReducer) => {
        return reducer.team.data;
    });
    useEffect(() => {
        appDispatch(getTeam());
    }, []);
    return (
        <section className={styles.ourTeam} id="ourTeam">
            <h2>Наша команда</h2>
            <div>
                {data.map((item) => (
                    <div key={item.id} className={styles.cardPerson}>
                        <img src={item.imgUrl} alt={`Фото ${item.imgUrl}`} />
                        <h3>{item.name}</h3>
                        <p>{item.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurTeam;

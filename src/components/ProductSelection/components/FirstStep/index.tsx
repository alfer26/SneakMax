import styles from './index.module.scss';
import { FC, useEffect } from 'react';
import keds from '../../../../assets/productSelection/sneakers/keds.png';
import running from '../../../../assets/productSelection/sneakers/running.png';
import cleats from '../../../../assets/productSelection/sneakers/cleats.png';
import basketball from '../../../../assets/productSelection/sneakers/basketball.png';
import tennis from '../../../../assets/productSelection/sneakers/tennis.png';
import forWalking from '../../../../assets/productSelection/sneakers/forWalking.png';
import { DataProductSelection } from '../../../../Types';

type Props = {
    takeOfferRef: React.MutableRefObject<HTMLFormElement | null>;
    dataProductSelection: DataProductSelection;
    emptyWarningUpdate: number | null;
    setDataProductSelection: React.Dispatch<React.SetStateAction<DataProductSelection>>;
    left: number;
    className: string;
    firstStepRef: React.MutableRefObject<HTMLDivElement | null>;
};

const sneakers = [
    {
        title: 'Кеды',
        imgURL: keds,
    },
    {
        title: 'Беговые',
        imgURL: running,
    },
    {
        title: 'Бутсы',
        imgURL: cleats,
    },
    {
        title: 'Баскетбольные',
        imgURL: basketball,
    },
    {
        title: 'Теннисные',
        imgURL: tennis,
    },
    {
        title: 'Для ходьбы',
        imgURL: forWalking,
    },
];

const FirstStep: FC<Props> = ({
    takeOfferRef,
    dataProductSelection,
    emptyWarningUpdate,
    setDataProductSelection,
    left,
    className,
    firstStepRef,
}) => {
    function handleChange() {
        if (takeOfferRef.current) {
            const formData = new FormData(takeOfferRef.current);
            const dataProductSelectionUpdate: DataProductSelection = { ...dataProductSelection };
            dataProductSelectionUpdate.types = formData.getAll('types');
            setDataProductSelection(dataProductSelectionUpdate);
        }
    }
    useEffect(() => {
        if (emptyWarningUpdate && firstStepRef.current) {
            const labels = [...firstStepRef.current.querySelectorAll('label.item')];
            labels.forEach((item) => {
                item.animate([{ left: '0px' }, { left: '-12px' }, { left: '0px' }], {
                    duration: 500,
                    easing: `linear(0 0%, 0.1 0.2%, 0.5 1%, 0.9 3%, 1.3 7%, 1.45 12%, 1.5 18%, 1.5 21.875%, 1.4 23%, 1.2 26%, 0.95 30%, 0.75 35%, 0.65 40%, 0.6 44%, 0.6 46.875%, 0.65 48%, 0.8 52%, 0.95 56%, 1.1 60%, 1.2 65%, 1.28 69%, 1.3 71.875%, 1.28 74%, 1.2 78%, 1.1 83%, 1.05 88%, 1.02 93%, 1 97%, 1 100%)`,
                });
            });
        }
    }, [emptyWarningUpdate]);
    return (
        <div
            ref={firstStepRef}
            className={`${styles.firstStep} ${className}`}
            style={{ inset: `0 ${left}% 0 ${-left}%` }}
        >
            <h3>Какой тип кроссовок рассматриваете?</h3>
            <div>
                {sneakers.map((item, index) => (
                    <label key={index} className="item">
                        <img src={item.imgURL} alt="Фото-шаблон" />
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="types"
                                value={item.title}
                                onChange={() => handleChange()}
                                checked={dataProductSelection.types.some((element) => element === `${item.title}`)}
                            />
                            <span>{item.title}</span>
                        </label>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FirstStep;

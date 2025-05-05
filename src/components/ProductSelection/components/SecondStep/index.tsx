import styles from './index.module.scss';
import image from '../../../../assets/productSelection/secondStepImage.png';
import { FC, useEffect, useRef } from 'react';
import { DataProductSelection } from '../../../../Types';

type Props = {
    takeOfferRef: React.MutableRefObject<HTMLFormElement | null>;
    dataProductSelection: DataProductSelection;
    emptyWarningUpdate: number | null;
    setDataProductSelection: React.Dispatch<React.SetStateAction<DataProductSelection>>;
    left: number;
    className: string;
    height: number;
};

const SecondStep: FC<Props> = ({
    takeOfferRef,
    dataProductSelection,
    emptyWarningUpdate,
    setDataProductSelection,
    left,
    className,
    height,
}) => {
    const secondStepRef = useRef<null | HTMLDivElement>(null);

    function handleChange() {
        if (takeOfferRef.current) {
            const formData = new FormData(takeOfferRef.current);
            const dataProductSelectionUpdate: DataProductSelection = { ...dataProductSelection };
            dataProductSelectionUpdate.sizes = formData.getAll('sizes');
            setDataProductSelection(dataProductSelectionUpdate);
        }
    }
    useEffect(() => {
        if (emptyWarningUpdate && secondStepRef.current) {
            const labels = [...secondStepRef.current.querySelectorAll('label.checkbox')];
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
            ref={secondStepRef}
            className={`${styles.secondStep} ${className}`}
            style={{ inset: `0 ${left}% 0 ${-left}%`, height: height }}
        >
            <h3>Какой размер вам подойдет?</h3>
            <div>
                <div>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="sizes"
                            value={'менее 36'}
                            onChange={() => handleChange()}
                            checked={dataProductSelection.sizes.some((item) => item === 'менее 36')}
                        />
                        <span>менее 36</span>
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="sizes"
                            value={'36-38'}
                            onChange={() => handleChange()}
                            checked={dataProductSelection.sizes.some((item) => item === '36-38')}
                        />
                        <span>36-38</span>
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="sizes"
                            value={'39-41'}
                            onChange={() => handleChange()}
                            checked={dataProductSelection.sizes.some((item) => item === '39-41')}
                        />
                        <span>39-41</span>
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="sizes"
                            value={'42-44'}
                            onChange={() => handleChange()}
                            checked={dataProductSelection.sizes.some((item) => item === '42-44')}
                        />
                        <span>42-44</span>
                    </label>
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="sizes"
                            value={'45 и больше'}
                            onChange={() => handleChange()}
                            checked={dataProductSelection.sizes.some((item) => item === '45 и больше')}
                        />
                        <span>45 и больше</span>
                    </label>
                </div>
                <img src={image} alt="Фото-шаблон" />
            </div>
        </div>
    );
};

export default SecondStep;

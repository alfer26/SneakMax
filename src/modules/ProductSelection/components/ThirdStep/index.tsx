import { FC } from 'react';
import styles from './index.module.scss';
import { DataProductSelection } from '../../../../Types';
type Props = {
    dataProductSelection: DataProductSelection;
    setDataProductSelection: React.Dispatch<React.SetStateAction<DataProductSelection>>;
    left: number;
    className: string;
    height: number;
};
const ThirdStep: FC<Props> = ({ dataProductSelection, setDataProductSelection, left, className, height }) => {
    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const dataProductSelectionUpdate: DataProductSelection = { ...dataProductSelection };
        dataProductSelectionUpdate.correction = e.currentTarget.value;
        setDataProductSelection(dataProductSelectionUpdate);
    }

    return (
        <div
            className={`${styles.thirdStep} ${className}`}
            style={{ inset: `0 ${left - 105}% 0 ${-(left - 105)}%`, height: height }}
        >
            <h3>Уточните какие-либо моменты</h3>
            <textarea
                placeholder="Введите сообщение"
                name="correction"
                onChange={handleChange}
                defaultValue={dataProductSelection.correction.toString()}
            ></textarea>
        </div>
    );
};

export default ThirdStep;

import { CSSProperties, FC } from 'react';

type Props = {
    fill: string;
    style?: CSSProperties;
};

const PhoneIcon: FC<Props> = ({ fill, style }) => {
    return (
        <svg style={style} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.0527 24.8644L0.370738 0.956325L1.31802 0L25 23.9081L24.0527 24.8644Z"
                fill={fill}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.6293 1.09188L0.947279 25L0 24.0437L23.682 0.135553L24.6293 1.09188Z"
                fill={fill}
            />
        </svg>
    );
};

export default PhoneIcon;

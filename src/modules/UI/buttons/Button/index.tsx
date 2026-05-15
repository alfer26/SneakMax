import { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './index.module.scss';

type Props = {
    variant: 'red' | 'grey' | 'transparent';
    children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ variant, children, className, onClick, ...props }: Props) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        
        if (e.detail > 0) {
            e.currentTarget.blur();
        }
    };

    return (
        <button className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...props} onClick={handleClick}>
            {children}
        </button>
    );
};

export default Button;

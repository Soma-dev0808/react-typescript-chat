import React from 'react';
import StyledLink from '../StyledLink';

import './FormLayout.scss';

type FormLayoutType = {
    formTitle: string,
    formAction: (e: React.FormEvent<HTMLFormElement>) => void,
    linkAddress: string,
    linkTitle: string,
    disabled?: boolean,
}

const FormLayout: React.FC<FormLayoutType> = ({
    formTitle,
    formAction,
    children,
    linkAddress,
    linkTitle,
    disabled = false,
}) => {
    return (
        <div className='form-outer-container'>
            <form className='form-inner-container' onSubmit={formAction}>
                <h1 className='form-header-text'>{formTitle}</h1>
                {children}
                <StyledLink
                    to={linkAddress}
                    title={linkTitle}
                    disabled={disabled}
                />
            </form>
        </div>
    );
};

export default FormLayout;
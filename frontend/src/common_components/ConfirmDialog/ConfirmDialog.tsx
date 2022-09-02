import React from 'react';
import Button from '../Button';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    isShow: boolean;
    headerText: string;
    bodyText: string;
    isAlert?: boolean; // If this it true, show only 'OK' button in the dialog.
    yesAction?: () => void;
    noAction?: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isShow,
    headerText,
    bodyText,
    isAlert = false,
    yesAction,
    noAction
}) => {
    return (
        isShow
            ? <div className='confirm-dialog-container'>
                <div className='confirm-dialog-content'>
                    <div className='confirm-dialog-header'>
                        <h3>
                            {headerText}
                        </h3>
                    </div>
                    <div className='confirm-dialog-body'>

                        <span className='confirm-dialog-body-text'>
                            {bodyText}
                        </span>

                        <div className='confirm-dialog-button-container'>
                            {isAlert
                                ? (
                                    <Button
                                        buttonText="Ok"
                                        size='sm'
                                        textBold
                                        primary
                                        classnames='confirm-dialog-button'
                                        onClickEvent={yesAction || noAction}
                                    />
                                )
                                : (
                                    <>
                                        <Button
                                            buttonText="Yes"
                                            size='sm'
                                            textBold
                                            primary
                                            classnames='confirm-dialog-button'
                                            onClickEvent={yesAction}
                                        />
                                        <Button
                                            buttonText="No"
                                            size='sm'
                                            textBold
                                            classnames='confirm-dialog-button'
                                            onClickEvent={noAction}
                                        />
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            : null
    );
};

export default ConfirmDialog;

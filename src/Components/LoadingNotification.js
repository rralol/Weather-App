import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

export default function LoadingNotification(props) {
    return (
        <Backdrop open= {props.loadingStatus}>
            <CircularProgress />
        </Backdrop>
    );
}
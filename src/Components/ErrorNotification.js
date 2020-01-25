import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


export default function ErrorNotification(props) {
    return (
        <Snackbar open = {props.errorStatus} onClose={props.disableError}>
            <Alert variant="filled" severity="error">
                Request error!
            </Alert>
        </Snackbar>
    );
}
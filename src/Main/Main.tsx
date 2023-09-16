import React from 'react';
import Dashboard from './Dashboard';
import CardContainer from './CardContainer';

export default function Main(): React.ReactElement {
    return <>
        <main>
            <Dashboard />
            <CardContainer />
        </main>
    </>
}
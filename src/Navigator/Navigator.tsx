import React from 'react';

export default function Navigator(): JSX.Element {

    return <>
        <nav>
            <time>
                {new Date().toISOString().split('T')[0]}
            </time>
            <h3>
                오늘의 수행자
            </h3>
            <ul>
                <li>성훈</li>
                <li className='strikethrough'>소희</li>
                <li className='strikethrough'>희진</li>
                <li>지현</li>
                <li>규</li>
            </ul>
        </nav>
    </>
}
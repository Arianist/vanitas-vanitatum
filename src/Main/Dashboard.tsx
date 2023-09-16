import React, { useEffect, useState } from 'react';
import { getDashboardData, getUsers } from '../Firebase';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { DocumentData } from 'firebase/firestore/lite';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<{ name: string }[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [usersData, setUsersData] = useState<DocumentData[] | []>([]);

    useEffect(() => {
        async function fetchData() {
            const dashboard = await getDashboardData();
            const users = await getUsers();
            setDashboardData(dashboard);
            setUsersData(users);
            setLoading(false);
        }

        fetchData();
    }, []);

    return <>
        <section id="dashboard">
            <h1>대시보드</h1>
            {loading ? <div>Loading...</div> :
                <LineChart width={800} height={400} data={dashboardData} margin={{ top: 5, right: 60, bottom: 5, left: 0 }}>
                    {dashboardData.map((date, index) => {
                        return <Line type="monotone" key={date.name} dataKey={usersData[index]?.name} stroke={usersData[index]?.color} />
                    })}

                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            }
        </section>
    </>
}
// const data = [
//     { name: '2023-09-07', 규: 0, 성훈: 0, 소희: 1, 희진: 1, 지현: 2 },
//     { name: '2023-09-08', 규: 7, 성훈: 0, 소희: 2, 희진: 4, 지현: 3 },
//     { name: '2023-09-09', 규: 7, 성훈: 1, 소희: 3, 희진: 4, 지현: 6 },
//     { name: '2023-09-10', 규: 7, 성훈: 1, 소희: 4, 희진: 4, 지현: 7 },
//     { name: '2023-09-11', 규: 7, 성훈: 1, 소희: 4, 희진: 4, 지현: 8 },
//     { name: '2023-09-12', 규: 7, 성훈: 1, 소희: 6, 희진: 8, 지현: 10 },
//     { name: '2023-09-13', 규: 7, 성훈: 1, 소희: 7, 희진: 8, 지현: 10 },
//     { name: '2023-09-14', 규: 7, 성훈: 1, 소희: 8, 희진: 8, 지현: 11 },
//     { name: '2023-09-15', 규: 14, 성훈: 1, 소희: 9, 희진: 9, 지현: 12 },
//     { name: '2023-09-16', 규: 14, 성훈: 5, 소희: 10, 희진: 9, 지현: 14 },
//     { name: '2023-09-17', 규: 14, 성훈: 7, 소희: 11, 희진: 9, 지현: 15 },
//     { name: '2023-09-18', 규: 14, 성훈: 7, 소희: 12, 희진: 14, 지현: 15 },
//     { name: '2023-09-19', 규: 14, 성훈: 7, 소희: 13, 희진: 14, 지현: 15 },
//     { name: '2023-09-20', 규: 14, 성훈: 15, 소희: 14, 희진: 14, 지현: 15 },
//     { name: '2023-09-21', 규: 14, 성훈: 15, 소희: 15, 희진: 15, 지현: 15 },
// ];
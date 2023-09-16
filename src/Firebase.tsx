import { initializeApp } from "firebase/app";
import {
    Timestamp,
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    DocumentData,
    setDoc,
    doc,
    getDoc
} from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyDSprkukfbQAU6BEKAbhWwvpIFeqyWpCBA",
    authDomain: "memorize-revelation.firebaseapp.com",
    projectId: "memorize-revelation",
    storageBucket: "memorize-revelation.appspot.com",
    messagingSenderId: "628705025244",
    appId: "1:628705025244:web:d3b2c60d748a1579bfa819"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 프로젝트 시작, 끝 날짜 가져옴
async function getProjectDate() {

    // 현재 진행중인 프로젝트의 문서의 데이터 획득
    const todayTimestamp: Timestamp = Timestamp.now();
    const q1 = query(
        collection(db, "Project"),
        where("start", "<=", todayTimestamp)
    );
    const q2 = query(
        collection(db, "Project"),
        where("end", ">=", todayTimestamp)
    );
    const documents1 = (await getDocs(q1)).docs;
    const documents2 = (await getDocs(q2)).docs;
    const documentIds1 = new Set(documents1.map(doc => doc.id));
    const commonDocument = documents2.filter(doc => documentIds1.has(doc.id))[0];
    const commonDocumentData = commonDocument.data();

    // 문서의 시작 날짜와 끝 날짜 획득
    const startDate = commonDocumentData.start.toDate();
    const endDate = commonDocumentData.end.toDate();

    return [startDate, endDate];
}

// 유저의 데이터를 가져옴
export async function getUsers() {
    const querySnapshot = await getDocs(collection(db, "Users"));
    const usersData: DocumentData[] = [];
    querySnapshot.forEach(doc => {
        usersData.push(doc.data());
    });

    return usersData;
}

// 매개변수 날짜와 일치하는 문서들을 가져옴
async function getMemorizeDocs(formetedDate: string) {
    const [todayStartTimestamp, todayEndTimestamp] = getStartEndTimestamp(formetedDate);
    const q = query(
        collection(db, "Memorize"),
        where("date", ">=", todayStartTimestamp),
        where("date", "<=", todayEndTimestamp)
    )
    const documents = (await getDocs(q)).docs

    return documents;
}

// 대시보드의 데이터 가져옴
export async function getDashboardData() {
    const DashboardData = [];

    // 데이터 수집
    const [startDate, endDate] = await getProjectDate();
    const usersName: {  // { 방성훈: 0, 원소희: 0, ... } 만듦
        [key: string]: number;
    } = {};
    (await getUsers()).forEach(item => {
        usersName[item.name] = 0;
    });

    // 프로젝트 기간 만큼 반복함
    for (let indexDate = startDate; indexDate <= endDate; indexDate.setDate(indexDate.getDate() + 1)) {
        const formatedDate = formatDate(new Date(indexDate));

        // 날짜와 같은 메모라이즈 문서들을 가져와서 forEach로 반복함
        const MemorizeDocs = getMemorizeDocs(formatedDate);
        (await MemorizeDocs).forEach(async memorizeDoc => {
            const docRef = doc(db, "Users", memorizeDoc.data().user.id)
            const userData = (await getDoc(docRef)).data();

            // 각 메모라이즈 문서의 개수만큼 해당 유저의 값을 1 증가시킴
            for (let userName in usersName) {
                if (userName === userData?.name) {
                    usersName[userName]++;
                }
            }
        })

        DashboardData.push({ name: formatedDate, ...usersName })
    }

    return DashboardData;
}


// 프로젝트 시간을 직접 설정함
async function setProjectTimestamp() {
    await setDoc(doc(db, "Project", "WiuQ6cAiSg8lSZSxBbNN"), {
        start: Timestamp.fromDate(new Date('2023-09-09')),
        end: Timestamp.fromDate(new Date('2023-09-28')),
    });
}
setProjectTimestamp();







// 날짜를 yyyy-MM-dd 형식으로 바꿔줌
function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// yyyy-MM-dd 날짜를 넣으면 그 날의 시작 시간 Date와 끝나는 시간 Date를 반환함
function getStartEndTimestamp(date: string) {
    const startTime = new Date(date);
    const endTime = new Date(date);
    // Set up start date
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);

    return [Timestamp.fromDate(startTime), Timestamp.fromDate(endTime)];
}
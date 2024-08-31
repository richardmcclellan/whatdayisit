
import WeekView from './WeekView';
import dayjs from 'dayjs';
import { rotationalDays } from '../constants/constants';

export default function App() {
    var subtitle = "No school today";
    const aisrDay = rotationalDays[dayjs().format('YYYY-MM-DD')]; 
    if(aisrDay) {
        subtitle = "Today is Day " + aisrDay;
    }
    
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>What Day Is It?</h2>
            <h1>{subtitle}</h1>
            <WeekView />
            <br/>
            Source: <a href="https://drive.google.com/file/d/17ovXfSUqTC6dVL6mhHM7rOaBNtloH0z_/view?usp=drive_link">AISR 2024-2025 Rotational Calendar</a>
        </div>
    );
}


import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from '../styles/WeekView.module.css';
import { rotationalDays } from '../constants/constants';

const classrooms = {
    '1C': { 1: 'PE', 4: 'PE', 5: 'Library' },
    '2B': { 2: 'PE', 4: 'PE', 6: 'Library' },
    '5B': { 1: 'PE', 4: 'Library', 5: 'PE' }
};

function WeekView() {
    const [weekOffset, setWeekOffset] = useState(0);
    const [myChildren, setMyChildren] = useState([]);
    const [childName, setChildName] = useState('');
    const [childClassroom, setChildClassroom] = useState('');

    useEffect(() => {
        const savedChildren = localStorage.getItem('myChildren');
        if (savedChildren) {
            setMyChildren(JSON.parse(savedChildren));
        }
    }, []);

    const today = dayjs().add(weekOffset, 'week').startOf('week').format('YYYY-MM-DD');
    const startOfWeek = dayjs(today).startOf('week');

    const weekDays = [];
    for (let i = 0; i < 5; i++) {
        const calendarDate = startOfWeek.add(i, 'day').format('YYYY-MM-DD');
        const aisrDay = rotationalDays[calendarDate];
        const activities = [];
        myChildren.forEach(child => {
            const activity = classrooms[child.classroom]?.[aisrDay];
            activities.push(activity ? activity : '');
        });

        weekDays.push({
            date: calendarDate,
            dayNumber: aisrDay,
            activities: activities
        });
    }

    const handleAddChild = (event) => {
        event.preventDefault();
        if (childName && childClassroom) {
            const updatedChildren = [...myChildren, { name: childName, classroom: childClassroom }];
            setMyChildren(updatedChildren);
            localStorage.setItem('myChildren', JSON.stringify(updatedChildren));
            setChildName('');
            setChildClassroom('');
        }
    };

    const handleDeleteChild = (index) => {
        const updatedChildren = myChildren.filter((_, childIndex) => childIndex !== index);
        setMyChildren(updatedChildren);
        localStorage.setItem('myChildren', JSON.stringify(updatedChildren));
    };

    return (
        <div className={styles.container}>
            <div className={styles.weekView}>
                <div className={styles.headerRow}>
                    <div className={styles.headerCell}>Date</div>
                    {myChildren.map((child, index) => (
                        <div key={child.name} className={styles.headerCell}>
                            {child.name}-{child.classroom}
                            <button className={styles.deleteButton} onClick={() => handleDeleteChild(index)}>X</button>
                        </div>
                    ))}
                </div>
                {weekDays.map(day => (
                    <div
                        key={day.date}
                        className={`${styles.day} ${day.date === dayjs().format('YYYY-MM-DD') ? styles.today : ''}`}
                    >
                        <div>
                            <div className={styles.date}>
                                {dayjs(day.date).format('ddd')}
                                <br/>
                                {dayjs(day.date).format('MMM DD')}
                            </div>
                            <div className={styles.aisrDay}>
                                {day.dayNumber !== undefined && (
                                    <div className={styles.dayNumber}>Day {day.dayNumber}</div>
                                )}
                            </div>
                        </div>
                        {day.activities.map((activity, index) => (
                            <div key={index} className={styles.activityCell}>
                                {activity}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => setWeekOffset(weekOffset - 1)}>Previous</button>
                <button className={styles.button} onClick={() => setWeekOffset(0)}>This Week</button>
                <button className={styles.button} onClick={() => setWeekOffset(weekOffset + 1)}>Next</button>
            </div>
            <form className={styles.form} onSubmit={handleAddChild}>
                <input
                    type="text"
                    placeholder="Child's Name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    required
                />
                <select
                    value={childClassroom}
                    onChange={(e) => setChildClassroom(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Class</option>
                    {Object.keys(classrooms).map(classKey => (
                        <option key={classKey} value={classKey}>{classKey}</option>
                    ))}
                </select>
                <button type="submit">Add child</button>
            </form>
        </div>
    );
}

export default WeekView;
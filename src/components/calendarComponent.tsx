import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { v4 as uuidv4 } from "uuid"; 

import './Calendar.css'

const CalendarComponent: React.FC = () => {
    const [events, setEvents] = useState<EventInput[]>([]);

    // Load events from local storage on component mount
    useEffect(() => {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    // Save events to local storage whenever events change
    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
    }, [events]);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // Clear date selection

        if (title && title.trim() !== '') {
            setEvents((prevEvents) => [
                ...prevEvents,
                {
                    id: uuidv4(), // Use uuid to generate a unique ID
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay,
                },
            ]);
        } else {
            alert('Event title cannot be empty');
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== clickInfo.event.id));
            clickInfo.event.remove(); // Remove event from calendar
        }
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            events={events}
            eventClick={handleEventClick}
        />
    );
};

export default CalendarComponent;

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Box, Button, Modal, TextField } from '@mui/material';

import './Calendar.css';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '20px',
    p: 4,
};

const CalendarComponent: React.FC = () => {
    const [events, setEvents] = useState<EventInput[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        setSelectedStartDate(selectInfo.start);
        setSelectedEndDate(selectInfo.end); // Get the end date from the selection
        setEventTitle(''); // Clear the title for new events
        setEditingEventIndex(null); // Reset editing index
        setModalIsOpen(true); // Open the modal on date select
    };

    const handleEventClick = (clickInfo: any) => {
        setSelectedStartDate(new Date(clickInfo.event.start)); // Get the event start date
        setSelectedEndDate(new Date(clickInfo.event.end )); // Get the event end date
        setEventTitle(clickInfo.event.title); // Set the title for editing
        setEditingEventIndex(events.findIndex(event => event.title === clickInfo.event.title)); // Set index for editing
        setModalIsOpen(true); // Open the modal for editing
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const newEvent: EventInput = {
            id: editingEventIndex !== null ? events[editingEventIndex].id : `${selectedStartDate?.toISOString()}-${eventTitle}`,
            title: eventTitle,
            start: selectedStartDate || '',
            end: selectedEndDate || '', // Set the end date
            allDay: false, // Set to false for time-based events
        };

        if (editingEventIndex !== null) {
            // Update existing event
            const updatedEvents = [...events];
            updatedEvents[editingEventIndex] = newEvent;
            setEvents(updatedEvents);
        } else {
            // Add new event
            setEvents([...events, newEvent]);
        }

        closeModal(); // Close the modal after submission
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div>
                <strong>{eventInfo.event.title}</strong>
                <div>{eventInfo.timeText}</div> {/* Custom time display */}
            </div>
        );
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay,dayGridMonth',
                }}
                initialView="timeGridWeek"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateSelect}
                events={events}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }}
            />

            <Modal open={modalIsOpen} onClose={closeModal}>
                <Box sx={style}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Event Title"
                            variant="outlined"
                            fullWidth
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            required
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="Start Date and Time"
                            variant="outlined"
                            type="datetime-local"
                            fullWidth
                            value={selectedStartDate ? selectedStartDate.toISOString().slice(0, 16) : ''}
                            onChange={(e) => setSelectedStartDate(new Date(e.target.value))}
                            required
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label="End Date and Time"
                            variant="outlined"
                            type="datetime-local"
                            fullWidth
                            value={selectedEndDate ? selectedEndDate.toISOString().slice(0, 16) : ''}
                            onChange={(e) => setSelectedEndDate(new Date(e.target.value))}
                            required
                            sx={{ mt: 2 }}
                        />
                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                            {editingEventIndex !== null ? 'Update Event' : 'Add Event'}
                        </Button>
                        <Button variant="outlined" onClick={closeModal} sx={{ mt: 2, ml: 2 }}>
                            Cancel
                        </Button>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default CalendarComponent;

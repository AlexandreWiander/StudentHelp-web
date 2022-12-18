import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";


export function Calendrier() {
    const [events, setEvents] = useState([]);
    const [meets, setMeets]=useState([]);

    let token: string | null = "";
    let idUser = -1;


    useEffect(() => {
        token = localStorage.getItem("JWT");
        const decodedToken = jwt_decode(token??"") as any;
        if(idUser==-1)idUser = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const body = { token:token, id:idUser};
        fetch("/api/agenda/getEvents", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result)=>{
                const list = result.listEvents;
                setEvents(list);
                setMeets(result.listMeets);
            })

    }, [events,]);

    const localizer = momentLocalizer(moment)

    return (
        <div className="h-1/3 ">
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>
        </div>
    );
}
export default Calendrier;

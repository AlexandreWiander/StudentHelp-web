import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import {Calendar, globalizeLocalizer, momentLocalizer} from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import globalize from 'globalize';
import {Event} from "./api/agenda/getEvents";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { toast } from "react-toastify";
import ICalParser from 'ical-js-parser';
import updateDb from "update-browserslist-db";
import AddMeetModal from "../components/AddMeetModal";

let token: string | null = "";
let idUser = -1;
const eventsArr: EventCalendar[]=[];

interface EventCalendar{
    title:string,
    start: Date,
    end: Date,
    allDay:boolean,
    isClass:boolean,
}

export default function Home() {
    const [events, setEvent]=useState(eventsArr);
    const [meets, setMeets]=useState([]);


    useEffect(() => {
        token = localStorage.getItem("JWT");
        const decodedToken = jwt_decode(token??"") as any;
        if(idUser==-1)idUser = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const body = { token:token, id:idUser, checkEvent:true};
        fetch("api/agenda/getLink",{
            method:"post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result)=>{
                if(result.link!="/") {
                    importClassLink(result.link);
                }else{
                    fetch("/api/agenda/getEvents", {
                        method: "post",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((result)=>{
                            const list = result.listEvents as Event[];
                            for(var i=0; i<list.length; i++){
                                var one = list[i];
                                const oneEvent : EventCalendar={
                                    title: one.title,
                                    start:new Date(one.start) as Date,
                                    end: new Date(one.end) as Date,
                                    allDay:false,
                                    isClass:one.isClass,
                                }
                                events.push(oneEvent);

                            }
                            setMeets(result.listMeets);
                        })
                }
            })
    }, []);

    const deleteRequest = (event: { currentTarget: { id: any; }; }) => {
        const body = {id: event.currentTarget.id, token: token, checkEvent:false};
        fetch("/api/agenda/deleteMeet", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
        fetch("/api/agenda/getEvents", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result)=>{
                const list = result.listEvents as Event[];
                for(var i=0; i<list.length; i++){
                    var one = list[i];
                    const oneEvent : EventCalendar={
                        title: one.title,
                        start:new Date(one.start) as Date,
                        end: new Date(one.end) as Date,
                        allDay:false,
                        isClass:one.isClass
                    }
                    events.push(oneEvent);

                }
                setMeets(result.listMeets);
            })
    };

    async function importClassLink(mylink: string) {
        var response = await fetch(mylink, {
            method: "get",
        });
        if (response.status == 200) {
            const body1 = {id: idUser, token: token};
            fetch("/api/agenda/deleteAllEventClass", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body1),
            });
            var contentString = new TextDecoder("utf-8").decode(await response.arrayBuffer());
            const resultJSON = ICalParser.toJSON(contentString);
            var eventsJson = resultJSON["events"];
            for (let i = 0; i < eventsJson.length; i++) {
                var event = eventsJson[i];
                var descriptionClass = event.description ?? "/";
                if (event.description!.indexOf("\\n") != -1 && event.description!.indexOf("\\n") != -1) descriptionClass = event.description!.substring(event.description!.indexOf("\\n") + 2, event.description!.indexOf("\\n", event.description!.indexOf("\\n") + 1));
                var posLieu = event.description!.indexOf("Lieu(x):\\n");
                var lieu = "/";
                var hourF = event.dtstart.value.substring(9, 10) + (parseInt(event.dtstart.value.substring(10, 11)) + 1);
                if (hourF == "010") hourF = "10";
                var hourT = event.dtend.value.substring(9, 10) + (parseInt(event.dtend.value.substring(10, 11)) + 1);
                if (hourT == "010") hourT = "10";
                var dateFrom = event.dtstart.value.substring(0, 4) + "-" + parseInt(event.dtstart.value.substring(4, 6)) + "-" + event.dtstart.value.substring(6, 8) + "T" + hourF + ":" + event.dtstart.value.substring(11, 13) + ":" + event.dtstart.value.substring(13, 15) + ".000Z";
                var dateTo = event.dtend.value.substring(0, 4) + "-" + parseInt(event.dtend.value.substring(4, 6)) + "-" + event.dtend.value.substring(6, 8) + "T" + hourT + ":" + event.dtend.value.substring(11, 13) + ":" + event.dtend.value.substring(13, 15) + ".000Z";
                if (posLieu != -1) lieu = event.description!.substring(posLieu + 10);
                const body = {
                    id: idUser,
                    token: token,
                    name: descriptionClass,
                    lieu: lieu,
                    from: dateFrom,
                    to: dateTo,
                    link: mylink
                };
                fetch("/api/agenda/addEventClass", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                });
            }
            const body = {token: token, id: idUser, checkEvent:true};
            fetch("/api/agenda/getEvents", {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((result) => {
                    const list = result.listEvents as Event[];
                    for (var i = 0; i < list.length; i++) {
                        var one = list[i];
                        const oneEvent: EventCalendar = {
                            title: one.title,
                            start: new Date(one.start) as Date,
                            end: new Date(one.end) as Date,
                            allDay: false,
                            isClass:one.isClass
                        }
                        events.push(oneEvent);
                    }
                    setMeets(result.listMeets);
                })
            toast.success("Horaire correctement importé !", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    async function importClass() {
        const eventsArr: EventCalendar[]=[];
        setEvent(eventsArr);
        var input = document.getElementById("link") as HTMLInputElement;
        var link = "/";
        if (input.value != undefined && input.value != "" && input.value != null) {
            link = input.value;
        }
        if (link != "/") {
            const body2 = {id: idUser, token: token, link: link};
            fetch("/api/agenda/updateLink", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body2),
            });
            importClassLink(link);
        } else {
            toast.error("Il faut encoder le lien de l'horaire à importer ! (un seul possible à la fois)", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const localizer = globalizeLocalizer(globalize);

    return (
        <div className="grid grid-cols-2 font-face-pg">
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700, width:700 }}
                    eventPropGetter={
                        (event, start, end, isSelected) => {
                            let newStyle = {
                                backgroundColor: "#5999FF",
                                color: 'black',
                                borderRadius: "0px",
                                border: "none"
                            };

                            if (event.isClass){
                                newStyle.backgroundColor = "#EF6B0C"
                            }

                            return {
                                className: "",
                                style: newStyle
                            };
                        }
                    }
                />
            </div>
            <div>
                <div className="flex flex-col items-center">
                    <h1 className="mb-2 text-2xl font-extrabold tracking-tight leading-none mt-4 text-center">Ajouter mes cours (à l'aide du lien)</h1>
                    <div className="flex flex-row m-2 w-full justify-center">
                        <input
                            placeholder="Lien cours"
                            className={`${styles.inputComment} w-1/2 rounded-full text-center shadow-md p-2 mx-2 font-face-pg h-14 focus:scale-105 transition duration-500 w-full`}
                            name="link"
                            id="link"
                            type="text"
                        />
                        <button className="bg-blueTheme text-white font-bold m-2 px-8 py-2 rounded" onClick={importClass}>Importer
                        </button>
                    </div>
                    <p>Attention l'ajout d'un lien horaire entrainera la suppression du précédent et de ses évènements liés !</p>
                    <div className="flex flex-col items-center text-center overflow-y-scroll h-1/2 scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300">
                        <h1 className="mb-2 text-2xl font-extrabold tracking-tight leading-none mt-4 text-center">Mes rendez-vous</h1>
                        <AddMeetModal id={idUser} />
                        {meets.map((meet) => {
                            var one = meet["event"];
                            var dateF =  new Date(one["start"]);
                            var date = dateF.getDate()  + "-" + (dateF.getMonth()+1) + "-" + dateF.getFullYear()
                            var dateFrom = dateF.getHours() + ":" + dateF.getMinutes();
                            var dateT = new Date(one["end"]);
                            var dateTo = dateT.getHours() + ":" + dateT.getMinutes();
                            return (
                                <div key={meet["id"]}
                                     className="w-4/5 h-1/3 grid grid-cols-6 m-4 p-4 border border-blueTheme bg-white rounded-lg shadow-md hover:bg-gray-100 items-center">
                                    <img src={"/images/avatar/" + meet["avatarMeet"] + ".png"}
                                         className="w-40 col-start-1 col-end-2"/>
                                    <div className="flex flex-col text-center col-start-2 col-end-4">
                                        <p className="font-bold">{date}</p>
                                        <p>{dateFrom+" - "+dateTo}</p>
                                    </div>
                                    <div className="col-start-4 col-end-6 flex flex-col text-center align-items">
                                        <h5 className="text-md font-bold text-center">{meet["nameMeet"]}</h5>
                                        <p>{one["title"]}</p>
                                        <p>{one["lieu"]}</p>
                                    </div>
                                    <div className="col-start-6 flex items-center">
                                        <button id={one["id"]} onClick={deleteRequest}><img src={"images/block.png"}
                                                                                                className="w-20"/>
                                        </button>
                                        <Link
                                            href={{
                                                pathname: "/chat/message",
                                                query: {id: one["personne"]}, // the data
                                            }}
                                        >
                                            <button className="flex flex-col items-center">
                                                <img src={"images/message.png"} className="w-8 col-start-5"/>
                                                <p className="text-center">Contacter</p>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}

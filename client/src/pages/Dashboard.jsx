import { useEffect, useState } from "react";
import { useUser } from "../contexts/userContext";
import EventCard from "../components/Dashboard/EventCard";
import Sidebar from "../components/Sidebar";
import DashboardInfo from "../components/Dashboard/DashboardInfo";
import VotingStatistic from "../components/Dashboard/VotingStatistic";
import AddButton from "../components/Dashboard/AddButton";
import NewEventModal from "../components/Dashboard/NewEventModal";

function Dashboard(){
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchEvents, setFetchEvents] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        (async() => {
            try {
                if(fetchEvents) {
                    setLoading(true);
                    const response = await fetch('/test/api/events');
                    console.log(response);
                    const data = await response.json();
                    setEvents(data);
                    console.log(data);
                    
                    // TODO count the number of candidates and voters of each event
                    data.forEach(event => {
                        event.candidateCount = 20;
                        event.voterCount = 20;
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setFetchEvents(false);
            }
        })();
    }, [fetchEvents]);

    return(
        <>
            {showModal && <NewEventModal closeModal={ () => setShowModal(false) } fetchEvents={ () => setFetchEvents(true) } />}
            <div className="grid grid-cols-[1fr_5fr] h-screen bg-slate-50">
                <Sidebar />
                <div className="px-10 py-10 flex flex-col overflow-auto">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <p>Welcome, { user.username }</p>
                    <div className="flex gap-7 mt-3">
                        <DashboardInfo/>
                        <VotingStatistic />
                    </div>
                    <p className="text-xl font-bold mt-7">Your Events</p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4 mt-3">
                        {
                            loading 
                                ? <p>Loading...</p> 
                                : events.length === 0
                                    ? <p>No events found</p>
                                    : events.map(event => (
                                        <EventCard key={event._id} event={event} fetchEventsHandler={ () => setFetchEvents(true) } />
                                    ))
                        }
                    </div>  
                </div>
            </div>
            <AddButton openModal={() => setShowModal(true)} />
        </>
    )
}

export default Dashboard;
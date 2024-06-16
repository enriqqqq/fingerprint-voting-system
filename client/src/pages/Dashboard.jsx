import { useEffect, useState } from "react";
import { useUser } from "../contexts/userContext";
import EventCard from "../components/Dashboard/EventCard";
import Sidebar from "../components/Sidebartest";
import DashboardInfo from "../components/Dashboard/DashboardInfo";
import VotingStatistic from "../components/Dashboard/VotingStatistic";
import AddButton from "../components/Dashboard/AddButton";
import NewEventModal from "../components/Dashboard/NewEventModal";
import { useHardware } from "../contexts/hardwareContext";

function Dashboard(){
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchEvents, setFetchEvents] = useState(true);
    const { user } = useUser();
    const { device } = useHardware();

    useEffect(() => {
        (async() => {
            try {
                if(fetchEvents) {
                    setLoading(true);
                    const response = await fetch('/test/api/events');
                    const data = await response.json();
                    setEvents(data);
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
            <div className="bg-slate-50 min-h-screen">
                <Sidebar />
                <div className="px-10 py-10 flex flex-col overflow-auto ml-64 min-h-screen">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <p>Welcome, { user.username }</p>
                    <div className="flex gap-7 mt-3 h-52">
                        <DashboardInfo/>
                        <VotingStatistic />
                    </div>
                    <div className="flex gap-3 items-center">
                        <p className="text-xl font-bold mt-7">Your Events {loading ? '' : `(${events.length})`}</p>
                        {
                            device ?
                                <p className="text-sm text-green-500 mt-8">Device connected</p>
                                : <p className="text-sm text-red-500 mt-8">Device not connected</p>
                        }
                    </div>
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
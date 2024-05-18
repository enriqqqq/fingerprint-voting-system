import { useState } from "react";
import EventCard from "../components/Dashboard/EventCard";
import Sidebar from "../components/Dashboard/Sidebar";
import DashboardInfo from "../components/Dashboard/DashboardInfo";
import VotingStatistic from "../components/Dashboard/VotingStatistic";
import AddButton from "../components/Dashboard/AddButton";
import NewEventModal from "../components/Dashboard/NewEventModal";

const events = [
    {
        id: 1,
        title: "6A Class Leader Election",
        description: "This is a description of your voting event.",
        candidateCount: 3,
        votersCount: 50,
    },
    {
        id: 2,
        title: "Event 2",
        description: "No description available.",
        candidateCount: 5,
        votersCount: 53,
    },
    {
        id: 3,
        title: "Event 3",
        description: "Description 3",
        candidateCount: 3,
        votersCount: 67,
    }
]

function Dashboard(){
    const [showModal, setShowModal] = useState(false);
    console.log();
    return(
        <>
            {showModal && <NewEventModal closeModal={() => setShowModal(false)} />}
            <div className="grid grid-cols-[1fr_5fr] h-screen bg-slate-50">
                <Sidebar />
                <div className="px-10 py-10 flex flex-col overflow-auto">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <p>Welcome, User</p>
                    <div className="flex gap-7 mt-3">
                        <DashboardInfo/>
                        <VotingStatistic />
                    </div>
                    <p className="text-xl font-bold mt-7">Your Events</p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4 mt-3">
                        {
                            events.map(event => (
                                <EventCard key={event.id} {...event} />
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
const events = [
    {
        id: 1,
        title: "Event 1",
        description: "Description 1",
        candidateCount: 3,
        votersCount: 50,
    },
    {
        id: 2,
        title: "Event 2",
        description: "Description 2",
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
    return(
        <>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="mt-3">Welcome, User</p>
            <div className="grid grid-cols-3 gap-4 mt-3">
                {events.map(event => (
                    <div key={event.id} className="bg-white p-3 rounded border border-black">
                        <h1 className="text-lg font-bold">{event.title}</h1>
                        <p>{event.description}</p>
                        <p>Candidates: {event.candidateCount}</p>
                        <p>Voters: {event.votersCount}</p>
                        <div className="flex">
                            <button className="bg-slate-400 px-7 py-2 rounded hover:brightness-75 font-semibold">Start</button>
                            <button className="bg-slate-400 px-7 py-2 rounded hover:brightness-75 font-semibold ml-2">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-0 right-0">
                <button className="bg-slate-400 px-7 py-2 rounded hover:brightness-75 font-semibold">+</button>
            </div>
        </>
    )
}

export default Dashboard;
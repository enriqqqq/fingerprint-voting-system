import { MdEdit, MdDelete } from "react-icons/md";
import Icon from '@mdi/react';
import { mdiAccount, mdiBallot } from '@mdi/js';

function EventCard({ ...event }) {
    return(
        <div className="bg-white p-3 rounded flex flex-col shadow-slate-100 shadow-md">
            <h1 className="text-lg font-bold">{event.title}</h1>
            <p className="text-xs text-gray-600">{event.description}</p>
            <div className="flex items-center mt-2 gap-1">
                <Icon path={mdiBallot} size={1} color="gray" />
                <p className="text-sm">{event.candidateCount} ballots</p>
            </div>
            <div className="flex items-center mb-2 gap-1">
                <Icon path={mdiAccount} size={1} color="gray" />
                <p className="text-sm">{event.votersCount} voters</p>
            </div>
            <div className="flex items-center justify-between">
                <button onClick={null} className="bg-slate-400 px-7 py-2 rounded hover:brightness-75 font-semibold">Start</button>
                <div className="flex gap-1">
                    <div className="" onClick={null}>
                        <MdEdit className="bg-white text-2xl cursor-pointer rounded hover:brightness-75"/>
                    </div>
                    <div className="" onClick={null}>
                        <MdDelete className="bg-white text-2xl cursor-pointer rounded hover:brightness-75"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard;
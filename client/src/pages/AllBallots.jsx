import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import propTypes from 'prop-types';
import SmallNav from "../components/SmallNav";

function AllBallots() {
    const [ballots, setBallots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await fetch('/test/api/ballots');
                if(response.status !== 200) {
                    setBallots([]);
                } else {
                    const data = await response.json();
                    setBallots(data.ballots);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            <Sidebar />
            <div className="px-10 py-10 flex flex-col overflow-auto ml-64 min-h-screen transition-all duration-300 ease-out max-sm:ml-0">
                <SmallNav />
                <h1 className="text-xl font-bold">All Ballots {loading ? '' : `(${ballots.length})`}</h1>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4 mt-3">
                    {
                        loading 
                            ? <p>Loading...</p> 
                            : ballots.map((ballot) => {
                                return(
                                    <Ballot key={ballot._id} ballot={ballot} />
                                )
                            })
                    }
                </div>
            </div>
        </div>
    )
}

function Ballot({ ballot }) {
    return (
        <div className="border p-5 rounded-lg bg-white">
            <div className="border-b">
                <p className="font-bold text-lg">{ballot.name}</p>
                <p className="text-xs mb-1">{ballot._id}</p>
            </div>

            <div className="mt-1">
                <p className="text-sm bg-orange-400 inline rounded font-bold px-1">event</p>
                <div className="">
                    <p className="text-sm">{ballot.eventDetails.title}</p>
                    <p className="text-xs">{ballot.eventDetails._id}</p>
                </div>
            </div>

        </div>
    )
}

Ballot.propTypes = {
    ballot: propTypes.object.isRequired
}

export default AllBallots;
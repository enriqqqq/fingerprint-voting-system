import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebartest";
import propTypes from 'prop-types';

function AllVoters() {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await fetch('/test/api/voters');
                if(response.status !== 200) {
                    console.log('Failed to fetch voters');
                } else {
                    const data = await response.json();
                    setVoters(data.voters);
                    console.log(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return(
        <>
            <div className="bg-slate-50 min-h-screen">
                <Sidebar />
                <div className="px-10 py-10 flex flex-col overflow-auto ml-64 min-h-screen">
                    <h1 className="text-xl font-bold">All Voters {loading ? '' : `(${voters.length})`}</h1>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-4 mt-3">
                        {
                            loading
                                ? <p>Loading...</p>
                                : voters.map((voter) => {
                                    return(
                                        <Voter key={voter._id} voter={voter} />
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function Voter({ voter }) {
    return(
        <div className="border p-5 rounded-lg bg-white">
            <div className="border-b">
                <p className="font-bold text-lg">{voter.name}</p>
                <p className="text-xs mb-1">{voter._id}</p>
            </div>

            <div className="mt-1">
                <p className="text-sm bg-orange-400 inline rounded font-bold px-1">event</p>
                <div className="">
                    <p className="text-sm">{voter.event_title}</p>
                    <p className="text-xs">{voter.event_id}</p>
                </div>
            </div>
        </div>
    );
}

Voter.propTypes = {
    voter: propTypes.object.isRequired
}

export default AllVoters;
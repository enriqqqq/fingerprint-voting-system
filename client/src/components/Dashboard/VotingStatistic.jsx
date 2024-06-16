import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function VotingStatistic(){
    const [loading, setLoading] = useState(true);
    const [displayChart, setDisplayChart] = useState(false);
    const [stats, setStats] = useState({event: {}, results: [], voters:[], votedCount: 0});
    const [event, setEvent] = useState({});

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                // Fetch the last voting event statistic
                const response1 = await fetch('/test/api/events/latest');
                const data1 = await response1.json();

                if(data1.length == 0) return;
                setEvent(data1[0]);

                const response2 = await fetch(`/test/api/events/${data1[0]._id}/results`);
                const data2 = await response2.json();

                if(response2.status !== 200) {
                    console.log('Failed to fetch results');
                } else {
                    console.log(data2);
                    setStats(data2);
                    setDisplayChart(true);
                }
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function dataProjection(data) {
        return data.map((item) => {
            console.log(item.votes.length);
            return {
                name: item.name,
                votes: item.votes.length
            }
        });
    }

    function findLongestName(data) {
        return data.reduce((acc, item) => {
            if(item.name.length > acc) {
                return item.name.length;
            }
            return acc;
        }, 0);
    }

    return(
        <div className="border flex-1 px-5 py-5 bg-white overflow-auto">
            <p className="font-bold">Last Voting Event Statistic</p>
            {displayChart && <p className="text-sm font-semibold">{event.title} <span className="text-xs font-normal">{event._id}</span></p>}
            <div className="mt-7 h-44 max-lg:h-64"> {/* this also defines the height for DashboardInfo when screen > lg */}
                {
                    loading
                        ? <div className="flex flex-col justify-center items-center h-full">Loading...</div>
                        : !displayChart
                            ? <div className="flex flex-col justify-center items-center h-full">No Event Started Yet.</div>
                            : <ResponsiveContainer width="100%" height={135*stats.results.length}>
                                <BarChart data={dataProjection(stats.results)} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" unit=" votes" allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" width={findLongestName(stats.results)*9}/>
                                    <Tooltip />
                                    <Bar dataKey="votes" fill="#8884d8" animationDuration={150} animationEasing="ease-out" />
                                    <Legend/>
                                </BarChart>
                              </ResponsiveContainer>
                }
            </div>
        </div>
    )
}

export default VotingStatistic;
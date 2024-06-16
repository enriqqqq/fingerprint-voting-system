import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NumericDataBlock from "../components/ResultPage/NumericDataBlock";
import Sidebar from "../components/Sidebar";
import VoteProgress from "../components/ResultPage/VoteProgress";
import { FaUserGroup } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import SmallNav from "../components/SmallNav";

function ResultPage(){
    const [stats, setStats] = useState({event: {}, results: [], voters:[], votedCount: 0});
    const [loading, setLoading] = useState(false);
    const [displayChart, setDisplayChart] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await fetch(`/test/api/events/${id}/results`);

                if(response.status !== 200) {
                    console.log('Failed to fetch results');
                } else {
                    const data = await response.json();
                    console.log(data);
                    const voted = data.results.reduce((acc, result) => acc + result.votes.length, 0);
                    setStats({...data, votedCount: voted});
                    setDisplayChart(true);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

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

    return (
        <div className="bg-slate-50">
            <Sidebar />
            <div className="px-10 py-10 flex flex-col overflow-auto ml-64 min-h-screen transition-all duration-300 ease-out max-sm:ml-0">
                <SmallNav/>
                <h1 className="text-xl font-bold">Results</h1>
                {loading
                    ? <>
                        <p>Loading</p>
                        <p className="text-xs">please wait...</p>
                      </>
                    : <>
                        <p>{stats.event.title}</p>
                        <p className="text-xs">{stats.event._id}</p>
                      </>}

                <div className="flex gap-5 mt-4 max-lg:flex-col">
                    <VoteProgress stats={stats} />
                    <NumericDataBlock data={stats.voters.length} text="Voters" icon={<FaUserGroup className="text-5xl fill-orange-300"/>} bgcolor="bg-orange-500" />
                    <NumericDataBlock data={stats.results.length} text="Ballots" icon={<FaClipboardList className="text-5xl fill-pink-300"/>} bgcolor="bg-pink-500"/>
                </div>

                <div className="mt-10">
                    {!displayChart 
                        ? <p>{"You didn't meet the requirement to show results"}</p>
                        : <ResponsiveContainer width="100%" height={200*stats.results.length}>
                            <BarChart data={dataProjection(stats.results)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" unit=" votes" allowDecimals={false} />
                                <YAxis type="category" dataKey="name" width={findLongestName(stats.results)*9}/>
                                <Tooltip />
                                <Bar dataKey="votes" fill="#8884d8" animationDuration={150} animationEasing="ease-out" />
                                <Legend/>
                            </BarChart>
                          </ResponsiveContainer>}
                </div>
                
            </div>
        </div>
    )
}

export default ResultPage;
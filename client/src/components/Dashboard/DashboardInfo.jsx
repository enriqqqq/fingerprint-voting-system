import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NumericDataBlock from '../ResultPage/NumericDataBlock';
import { FaUserGroup } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";

function DashboardInfo() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch('/test/api/users/stats');
                if(response.status !== 200) {
                    console.log('Error');
                    setStats({voters: 0, ballots: 0});
                } else {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    return (
        <div className="flex flex-col gap-1 w-64 max-lg:w-full">
            {
                loading 
                    ? <p className="`border px-7 py-5 flex flex-col justify-center flex-1" >Loading...</p>
                    : <>
                        <NumericDataBlock data={stats.ballots} text="Ballots Created" icon={<FaClipboardList className="text-5xl fill-pink-300"/>} bgcolor="bg-pink-500"/>
                        <NumericDataBlock data={stats.voters} text="Voters Registered" icon={<FaUserGroup className="text-5xl fill-orange-300"/>} bgcolor="bg-orange-500"/>
                      </>
            }
        </div>
    )
}

function Items({ title, data }) {
    return (
        <div className="border px-7 py-5 flex flex-col justify-center flex-1">
            <p className="">{title}</p>
            <p className="font-bold text-lg">{data}</p>
        </div>
    )
}

Items.propTypes = {
    title: propTypes.string.isRequired,
    data: propTypes.number.isRequired
}

export default DashboardInfo;
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
        <div className="flex flex-col bg-white">
            {
                loading 
                    ? <p className="`border px-7 py-5 flex flex-col justify-center flex-1" >Loading...</p>
                    : <>
                        <Items title="Ballots Registered" data={stats.ballots} />
                        <Items title="Voters Registered" data={stats.voters}/>
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
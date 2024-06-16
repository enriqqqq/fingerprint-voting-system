import { FaCircleCheck } from "react-icons/fa6";
import propTypes from 'prop-types';

function VoteProgress({ stats }){
    return(
        <div className="flex-1 h-32 px-6 py-6 bg-green-500 relative rounded shadow-sm">
            {/* This is the participation display bar */}
            <div className={`absolute top-0 left-0 h-full bg-green-600 transition-all duration-500 ease-out rounded-l ${stats.votedCount/stats.voters.length == 1 ? 'rounded-r' : ''}`} style={{width: `${stats.voters.length > 0 ? (stats.votedCount * 100 / stats.voters.length).toFixed(2) : '0.00'}%`}}></div>

            {/* This is the text */}
            <div className="flex w-full h-full justify-between items-center relative z-10">
                <div className="flex justify-center items-center">
                    <FaCircleCheck className="text-5xl fill-green-300"/>
                </div>
                <div className="flex flex-col items-end justify-center text-white">
                    <p className="text-2xl font-bold">{`${stats.voters.length > 0 ? (stats.votedCount * 100 / stats.voters.length).toFixed(2) : '0.00'}%`}</p>
                    <p>Participation</p>
                    <p className="text-xs">({stats.votedCount} voted)</p>
                </div>
            </div>
        </div>
    )
}

VoteProgress.propTypes = {
    stats: propTypes.object.isRequired
}

export default VoteProgress;

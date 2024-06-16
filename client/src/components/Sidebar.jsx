import { FaFingerprint, FaUserGroup } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdBallot } from "react-icons/md";

function Sidebar(){
    const { logout } = useUser();
    const navigate = useNavigate();

    return(
        <div className="h-screen w-64 fixed bg-slate-900 px-7 py-7 flex flex-col transition-transform max-sm:-translate-x-64 duration-300 ease-out">

            <div className="flex gap-3 justify-center items-center">
                <FaFingerprint className="text-white text-3xl"/>
                <h1 className="text-white font-bold text-2xl">APPNAME.</h1>
            </div>

            <div className="my-6 flex-col flex text-white gap-2 overflow-auto">
                <div className="flex items-center gap-3 hover:cursor-pointer hover:bg-slate-700 rounded" onClick={()=>navigate('/')}>
                    <MdDashboard className="text-3xl"/>
                    <p className="text-white font-bold text-xl">Dashboard</p>
                </div>
                <div className="flex items-center gap-3 hover:cursor-pointer hover:bg-slate-700 rounded" onClick={()=>navigate('/ballots')}>
                    <MdBallot className="text-3xl"/>
                    <p className="font-bold text-xl">Ballots</p>
                </div>
                <div className="flex items-center gap-3 hover:cursor-pointer hover:bg-slate-700 rounded" onClick={()=>navigate('/voters')}>
                    <FaUserGroup className="text-3xl"/>
                    <p className="text-white font-bold text-xl">Voters</p>
                </div>
            </div>

            <div className="flex items-center mt-auto gap-3 hover:cursor-pointer hover:bg-slate-700" onClick={ logout }>
                <IoLogOutOutline className="text-white text-4xl"/>
                <p className="text-white font-bold backdrop:text-xl">Logout</p>
            </div>
        </div>
    )
}

export default Sidebar;
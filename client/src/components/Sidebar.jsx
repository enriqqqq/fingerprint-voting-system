import { FaFingerprint } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { useUser } from "../contexts/userContext";

function Sidebar(){
    const { logout } = useUser();

    return(
        <div className="bg-slate-900 px-7 py-7 flex flex-col">
            <div className="flex gap-3 justify-center items-center">
                <FaFingerprint className="text-white text-3xl"/>
                <h1 className="text-white font-bold text-2xl">APPNAME.</h1>
            </div>
            <div className="flex items-center mt-auto gap-3 hover:cursor-pointer hover:bg-slate-700" onClick={ logout }>
                <IoLogOutOutline className="text-white text-4xl"/>
                <p className="text-white font-bold backdrop:text-xl">Logout</p>
            </div>
        </div>
    )
}

export default Sidebar;
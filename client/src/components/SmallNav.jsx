import { FaFingerprint, FaUserGroup } from "react-icons/fa6";
import { MdDashboard, MdBallot } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import propTypes from 'prop-types';

function SmallNav() {
    const navigate = useNavigate();
    const { logout } = useUser();

    return(
        <div className="hidden bg-slate-900 rounded px-5 py-5 mb-6 max-sm:flex transition-all duration-300 ease-out">
            <div className="flex items-center gap-2">
                <FaFingerprint className="text-white text-3xl"/>
                <p className="text-white font-bold">APPNAME.</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <NavButton icon={<MdDashboard className="text-3xl"/>} onClick={()=>navigate('/')}/>
                <NavButton icon={<MdBallot className="text-3xl"/>} onClick={()=>navigate('/ballots')}/>
                <NavButton icon={<FaUserGroup className="text-3xl"/>} onClick={()=>navigate('/voters')}/>
                <NavButton icon={<IoLogOutOutline className="text-4xl"/>} onClick={()=>logout()}/>
            </div>
        </div>
    )
}

function NavButton({ icon, onClick }) {
    return(
        <div className="hover:cursor-pointer hover:bg-slate-700 rounded text-white text-3xl" onClick={onClick}>
            {icon}
        </div>
    )
}

NavButton.propTypes = {
    icon: propTypes.node.isRequired,
    onClick: propTypes.func.isRequired
}

export default SmallNav;
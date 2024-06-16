import propTypes from 'prop-types'
import { IoIosAdd } from "react-icons/io";

function AddButton({ openModal }) {
    return (
        <div className="fixed bottom-7 right-7 flex z-0">
            <button onClick={openModal} className="shadow-md items-center justify-center flex rounded-full bg-slate-400 px-2 py-2 hover:brightness-75 font-semibold h-12 w-12">
                <IoIosAdd />
            </button>
        </div>
    )
}

AddButton.propTypes = {
    openModal: propTypes.func.isRequired
}

export default AddButton;
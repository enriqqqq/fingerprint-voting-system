import propTypes from 'prop-types'
import { useState } from 'react';

function EventForm({ event }) {
    const [errors, setErrors] = useState({});
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [showSuccess, setShowSuccess] = useState(false);

    const showSuccessMessage = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;

        const response = await fetch(`/test/api/events/${event._id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        });

        if(response.status === 200) {
            setErrors({});
            setTitle(title);
            setDescription(description);
            showSuccessMessage();
        }
        else if (response.status === 400) {
            const data = await response.json();
            setErrors(data.errors);
        }
        else {
            setErrors({ title: "An error occurred. Please try again." });
        }
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-1 mt-3">
                <label htmlFor="title" className="text-xs font-bold text-gray-600">TITLE</label>
                <input type="text" name="title" id="title" className="border border-black rounded px-2 py-2" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                { errors.title ? <ErrorMessage string={errors.title}/> : null }
            </div>
            <div className="flex flex-col mt-3 gap-1">
                <label htmlFor="description" className="text-xs font-bold text-gray-600">DESCRIPTION</label>
                <textarea name="description" id="description" cols="30" rows="5" className="resize-none border border-black rounded px-2 py-2" placeholder='(Optional)' value={description} onChange={(e) => {setDescription(e.target.value)}}></textarea>
                { errors.description ? <ErrorMessage string={errors.description}/> : null }
            </div>
            <div className="flex items-center mt-3 gap-5">
                <button type="submit" className="bg-slate-400 text-black px-7 py-2 rounded hover:brightness-75 font-semibold">Edit</button>
                { showSuccess && <p className="text-sm font-bold text-green-500">Event edited successfully</p> }
            </div>
        </form>
    )
}

function ErrorMessage({ string }) {
    return(
        <>
            <p className="text-xs text-red-500">{string}</p>
        </>
    )
}

ErrorMessage.propTypes = {
    string : propTypes.string.isRequired,
}

EventForm.propTypes = {
    event: propTypes.shape({
        title: propTypes.string.isRequired,
        description: propTypes.string.isRequired,
        _id: propTypes.string.isRequired,
        user_id: propTypes.string
    })
}

export default EventForm;
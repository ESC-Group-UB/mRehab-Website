import React from "react";
import axios from "axios";

export default function AddViewer() {

    const handleSubmit = (e: React.FormEvent) => {
        console.log("Add Viewer form submitted");
        // Handle form submission logic here
        // api to call 
        e.preventDefault();
    }

    return (
        <div>
        <h2>Add Viewer</h2>
        <p>This feature is under development.</p>
        {/* Add form or functionality to add a viewer here */}
        <form>
            <input type="text" placeholder="Enter viewer email" />
            <button type="submit" onSubmit={handleSubmit}>Add Viewer</button>
        </form>

        </div>
    );
    }
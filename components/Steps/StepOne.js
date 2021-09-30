import { TextField } from "@mui/material"
import { useState } from "react";

const dev = process.env.NODE_ENV === 'development';

const StepOne = () => {

    // Customer details
    const [firstName, setFirstName] = useState(dev ? 'Jane' : '');
    const [lastName, setLastName] = useState(dev ? 'Doe' : '');
    const [email, setEmail] = useState(dev ? 'janedoe@email.com' : '');
     
    return (
        <>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </>
    ) 
}

export default StepOne;
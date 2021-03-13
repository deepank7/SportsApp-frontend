import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {UserContext} from '../../user-context'

export default function Login({ history }) {
    const { setIsloggedIn } = useContext(UserContext);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("false")

    const handleSubmit = async evt => {
        evt.preventDefault();

        const response = await api.post('/login', { email, password });
        const user_id = response.data.user_id || false;
        const user = response.data.user || false;

        try {
            if (user && user_id) {
                localStorage.setItem('user', user)
                localStorage.setItem('user_id', user_id)
                setIsloggedIn(true)
                history.push('/')
            } else {
                const { message } = response.data;
                setError(true);
                setErrorMessage(message);
                setTimeout(() => {
                    setError(false);
                    setErrorMessage("")
                }, 2000)
            }
        } catch (error) {
            setError(true)
            setErrorMessage(error)
        }

    }
    return (
        <div>
            <h3><center>Login</center></h3>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="exampleEmail" hidden>Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Your Email" onChange={evt => setEmail(evt.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword" hidden>Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="Your Password" onChange={evt => setPassword(evt.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Button className="submit-btn">Submit</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/register")}>Not a member?</Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger"> {errorMessage}</Alert>
            ) : ""}
        </div>
    )
}
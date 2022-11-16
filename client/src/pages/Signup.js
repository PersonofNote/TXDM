import React, {useState} from 'react'
import { Link } from 'react-router-dom';

//import '../styles/dashboard.css';


const api_url = "http://localhost:8080/"

const Signup = () => {
    const [formValues, setFormValues] = useState({
        companyName: null,
        email: null,
        password: null
    })

    const [message, setMessage] = useState(null)

    const handleChange = e => {
        console.log(e.currentTarget);
        const attName = e.currentTarget.name;
        const value = e.currentTarget.value;
        setFormValues({...formValues, [attName]: value}, console.log(JSON.stringify(formValues)))
    }

    const signUp = () => {
        if (formValues.companyName && formValues.email && formValues.password){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            };
            fetch(`${api_url}api/auth/signup`, requestOptions)
                .then(response => response.json())
                .then(res => setMessage(res.message));
        }
        else {
            setMessage("One or more values is missing, please fill in all values and try again.")
        }
    };

  return (
    <main>
        <div className="form-container">
            <h1>Sign Up</h1>
        <input
            required
            onChange={handleChange}
            value={formValues.companyName}
            label={"Enter Your Company Name"}
            name="companyName" 
        />
        <input
        required
        onChange={handleChange}
        value={formValues.email}
        label={"Enter an Email"}
        name="email" 
        />
        <input
            required
            onChange={handleChange}
            type='password'
            value={formValues.password}
            label={"Enter a Password"}
            name="password" 
        />
        <button onClick={() => signUp(formValues.username, formValues.email, formValues.password)} > Sign Up </button>
        <div> Already have an account? <Link to="/signin">Sign In</Link></div>
        </div>
        <div className="form-container error-message">{message}</div>
    </main>
  );
}

export default Signup;

import Login from './Login';
import OneTimePassword from './OneTimePassword';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function App({ user, requireMfa }) {
  const [patients, setPatients] = useState([])
  // User enabled MFA but did not verify code, show OTP form
  if (requireMfa) {
    return <OneTimePassword enabled={true} />;
  }

  const getPatients = async () => {
    const patientsResp = await axios.get("https://alexgr.ro/ehealth/patients.json")
    console.log(patientsResp)
    setPatients(patientsResp.data)
  }

  useEffect(() => {
    getPatients()
  }, [])

  // User not logged in, show login form
  if (!user) {
    return <Login />;
  }
  
  

  // User is authenticated
  return (
    <div>
      <p>
        Hello, {user.username}. <a href="/logout">Logout</a>
      </p>

      {user.mfaEnabled ? (
        user.username === 'alan' ? (
          <>
          <p> Congrats. MFA is enabled and you have admin rights. Therefore, you can visualize the following list of patients </p>
          {patients.map((val) => <li>{val.first_name} {val.last_name}</li>)} 
          </>
        ) : (
          <p> Congrats. MFA is enabled and you have user rights. Unfortunately, you cannot visualize the list of patients due to GDPR</p>
        )
        ) : (
        <OneTimePassword enabled={false} />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

function FormField(props) {
  let element;

  element = <div className="mb-4">
    <label className=" font-medium mb-2" htmlFor={props.id}>{props.children}</label>
    <input
      className="border border-gray-400 p-2 w-full"
      type={props.type}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
    />
  </div>

  return element;
};

const Register = () => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Fname: '',
    Lname: '',
    email: '',
    password: '',
    address: {
      street_address: '',
      city: '',
      state: '',
      zip_code: ''
    },
    DOB: ''
  });

  const onChange = (event) =>
    setFormData({ ...formData, [event.target.id]: event.target.value });

  const onAddressChange = (event) =>
    setFormData({
      ...formData,
      address: { ...formData.address, [event.target.id]: event.target.value }
    });

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios
      .post('http://localhost:5000/register', formData, config)
      .then((res) => {
        console.log(res.data);
        history.push('/');
      })
      .catch((err) => {
        console.log(err.message);
        setError(err.mesasge);
      });
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-medium mb-4">Register</h2>
        <FormField type="text" id="Fname" value={formData.Fname} onChange={onChange}>First Name</FormField>
        <FormField type="text" id="Lname" value={formData.Lname} onChange={onChange}>Last Name</FormField>
        <FormField type="text" id="email" value={formData.email} onChange={onChange}>Email</FormField>
        <FormField type="password" id="password" value={formData.password} onChange={onChange}>Password</FormField>
        <FormField type="text" id="street_address" value={formData.address.street_address} onChange={onAddressChange}>Street Address</FormField>
        <FormField type="text" id="city" value={formData.address.city} onChange={onAddressChange}>City</FormField>
        <FormField type="text" id="state" value={formData.address.state} onChange={onAddressChange}>State</FormField>
        <FormField type="text" id="zip_code" value={formData.address.zip_code} onChange={onAddressChange}>Zip</FormField>
        <FormField type="text" id="DOB" value={formData.DOB} onChange={onChange}>Date of Birth</FormField>
        <input type="submit" value="Submit" className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600" />
      </form>
    </div>
  );
}
export default Register;
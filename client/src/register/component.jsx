import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import '@tailwindcss/ui';

const Register = () => {
	const history = useHistory();
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

	const {
		Fname,
		Lname,
		email,
		password,
		address: { street_address, city, state, zip_code },
		DOB
	} = formData;

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onAddressChange = e =>
		setFormData({
			...formData,
			address: { ...formData.address, [e.target.name]: e.target.value }
		});

	const onSubmit = async e => {
		e.preventDefault();
		try {
			const newUser = {
				Fname,
				Lname,
				email,
				password,
				address: { street_address, city, state, zip_code },
				DOB
			};
			const config = {
				headers: {
					'Content-Type': 'application/json'
				}
			};
			const body = JSON.stringify(newUser);
			const res = await axios.post('http://localhost:5000/register', body, config);
			console.log(res.data);
			history.push('/');
		} catch (err) {
			console.error(err.response.data);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-200">
			<Form className="bg-white p-6 rounded-lg shadow-xl">
				<FormGroup>
					<Label for="Fname">First Name</Label>
					<Input
						type="text"
						name="Fname"
						id="Fname"
						placeholder="Enter your first name"
						className="bg-gray-200 p-2 rounded-lg"
						value={Fname}
						onChange={e => onChange(e)}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="Lname">Last Name</Label>
					<Input
						type="text"
						name="Lname"
						id="Lname"
						placeholder="Enter your last name"
						className="bg-gray-200 p-2 rounded-lg"
						value={Lname}
						onChange={e => onChange(e)}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="email">Email</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Enter your email"
						className="bg-gray-200 p-2 rounded-lg"
						value={email}
						onChange={e => onChange(e)}
					/>
				</FormGroup>
			</Form>
		</div>
	);
}
export default Register;
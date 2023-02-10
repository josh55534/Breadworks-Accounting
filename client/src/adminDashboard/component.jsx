import React, { useEffect, useState } from 'react'


function AdminPage() {
	const token = localStorage.getItem('token');
	if (!token) {
 	 return <Redirect to="/login/" />;
}
const config = {
	headers: {
	  Authorization: `Bearer ${token}`
	}
  };
  
const [data, setData] = useState(null);
	useEffect(() => {
	  fetch('http://localhost:5000/adminDashboard', config)
		.then(response => response.text())
		.then(text => setData(text));
	}, []);

  return (
   <div className="bg-red-500">
	  {data ? <div >{data}</div> : <div >Loading...</div>}
   </div>
  )
}

export default AdminPage
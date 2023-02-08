import React, { useEffect, useState } from 'react'

function App() {
	const [data, setData] = useState(null);
  
	useEffect(() => {
	  fetch('http://localhost:5000/')
		.then(response => response.text())
		.then(text => setData(text));
	}, []);

  return (
   <div className="w-screen h-screen bg-red-300">
	  {data ? <div>{data}</div> : <div>Loading...</div>}
   </div>
  )
}

export default App

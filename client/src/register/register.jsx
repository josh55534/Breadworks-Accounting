import React from 'react';
import { createRoot } from 'react-dom/client';
import Register from './component'
import '../index.css'

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<Register />);
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="empty-state not-found"><div className="empty-icon">404</div><h1>Page not found</h1><p>The requested route does not exist in the mock application.</p><Link className="primary-button inline" to="/">Back to Home</Link></div>;
}

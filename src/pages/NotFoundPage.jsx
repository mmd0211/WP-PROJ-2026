import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="empty-state not-found"><div className="empty-icon">404</div><h1>این صفحه پیدا نشد</h1><p>آدرس واردشده در نسخه ماک وجود ندارد.</p><Link className="primary-button inline" to="/">بازگشت به خانه</Link></div>;
}

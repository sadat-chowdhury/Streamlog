import React from 'react';
import "../css/footer.css"; // Optional CSS file for styling

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} StreamLog. IT390.</p>
    </footer>
  );
};

export default Footer;

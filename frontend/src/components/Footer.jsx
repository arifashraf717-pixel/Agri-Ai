import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-auto">
      &copy; {new Date().getFullYear()} AgriAI. All rights reserved.
    </footer>
  );
}

export default Footer;

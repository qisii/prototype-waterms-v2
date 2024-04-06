import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav>
      <i
        className="fa-solid fa-bars toggle-sidebar"
        onClick={toggleSidebar}
      ></i>
      <form action="">
        <div className="form-group">
          <input type="text" placeholder="Search..." />
          <i className="bx bx-search icon"></i>
        </div>
      </form>
      <Link to="#" className="nav-link">
        <i className="bx bx-bell icon"></i>
        <span className="badge">3</span>
      </Link>
      <span className="divider"></span>
      <div
        className={`profile ${isProfileOpen ? "active" : ""}`}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        <img src="/images/profile1.jpg" alt="" />
        {isProfileOpen && (
          <ul className="profile-down show">
            <li>
              <Link to="#" className="profile-link">
                <i class="bx bx-user-circle icon"></i> Profile
              </Link>
            </li>
            {/* <li>
            <Link to="#" className="profile-link">
              <i className="bx bxs-cog icon"></i> Settings
            </Link>
          </li> */}
            <li>
              <Link to="#" className="profile-link logout">
                <i class="bx bx-log-out-circle icon"></i> Logout
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Topbar;

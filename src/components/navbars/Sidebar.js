import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";

const Sidebar = () => {
  const { isSidebarVisible } = useSidebar();
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  const [isVisualizationActive, setIsVisualizationActive] = useState(false);
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false);

  useEffect(() => {
    const visualizationPaths = [
      "/visualization/building",
      "/visualization/weekly",
    ];
    const hasActiveLink = visualizationPaths.some((path) =>
      location.pathname.startsWith(path)
    );
    setIsVisualizationActive(hasActiveLink);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarVisible) {
      setIsVisualizationOpen(false); // Close visualization dropdown when sidebar is not visible
    }
  }, [isSidebarVisible]);

  useEffect(() => {
    if (!isSidebarVisible && !isVisualizationOpen) {
      setIsVisualizationOpen(false); // Close visualization dropdown when both sidebar and visualization are not visible
    }
  }, [isSidebarVisible, isVisualizationOpen]);

  const handleMouseEnter = () => {
    if (!isSidebarVisible) {
      document.querySelectorAll("#sidebar .divider").forEach((item) => {
        item.textContent = item.dataset.text;
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isSidebarVisible) {
      document.querySelectorAll("#sidebar .divider").forEach((item) => {
        item.textContent = "-";
      });
      const dropdown = document.querySelector(".side-dropdown");
      if (dropdown) {
        dropdown.classList.remove("show"); // Remove 'show' class from side-dropdown
      }
    }
  };

  // const handleVisualizationClick = () => {
  //   if (!isSidebarVisible) {
  //     setIsVisualizationOpen(true); // Open visualization if sidebar is not visible
  //   } else {
  //     setIsVisualizationOpen(!isVisualizationOpen); // Toggle visualization otherwise
  //   }
  // };

  useEffect(() => {
    setIsVisualizationOpen(isVisualizationActive);
  }, [isVisualizationActive]);

  useEffect(() => {
    if (!isSidebarVisible) {
      setIsVisualizationActive(true);
      setIsVisualizationOpen(false);
    }
  }, [isVisualizationActive]);

  return (
    <section
      id="sidebar"
      className={`sidebar ${!isSidebarVisible ? "hide" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="#" className="brand">
        <i className="bx bx-droplet icon"></i> WaterMs
      </Link>

      <ul className="side-menu">
        <li>
          <Link
            to="/dashboard"
            className={`side-link ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <i className="bx bx-grid-alt icon"></i> Dashboard
          </Link>
          {!isSidebarVisible && (
            <li className="divider" id="dividerElement" data-text="Main">
              -
            </li>
          )}
          {isSidebarVisible && (
            <li className="divider" data-text="Main" id="dividerElement">
              Main
            </li>
          )}
          <li>
            <Link
              to="/users"
              className={`side-link ${
                location.pathname === "/users" ? "active" : ""
              }`}
            >
              <i className="bx bx-group icon"></i> Users
            </Link>
          </li>
          <li>
            <div
              className={`side-link ${
                isVisualizationOpen || isVisualizationActive ? "active" : ""
              }`}
              onClick={() => setIsVisualizationOpen(!isVisualizationOpen)}
            >
              <i className="bx bx-bar-chart-alt-2 icon"></i> Visualization
              <i className="bx bx-chevron-right icon-right"></i>
            </div>
            {/* {isSidebarVisible && isVisualizationOpen && ( */}
            {isVisualizationOpen && (
              <ul className="side-dropdown show">
                <li>
                  <Link
                    to="/visualization/building"
                    className={`side-link drop-link ${
                      location.pathname === "/visualization/building"
                        ? "active"
                        : ""
                    }`}
                  >
                    Building
                  </Link>
                </li>
                <li>
                  <Link
                    to="/visualization/weekly"
                    className={`side-link drop-link ${
                      location.pathname === "/visualization/weekly"
                        ? "active"
                        : ""
                    }`}
                  >
                    Weekly
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="#" className="side-link">
              <i className="bx bx-pulse icon"></i> Billing
            </Link>
          </li>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;

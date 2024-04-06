import React from "react";
import Sidebar from "../../components/navbars/Sidebar";
import Topbar from "../../components/navbars/Topbar";
import Tabs from "../../components/Tabs";

const Building = ({ title }) => {
  return (
    <div>
      <Sidebar />
      <section id="content" className="content">
        <Topbar />
        <main>
          <h1 className="title">{title}</h1>
          {/* insert Tab component */}

          <div className="tab-main">
            <Tabs />
          </div>
        </main>
      </section>
    </div>
  );
};

export default Building;

import { NavLink } from "react-router-dom";

function Sidebar() {

  return (
    <aside className="sidebar">

      <div className="logo">
        MyBank
      </div>

      <nav>

        <NavLink to="/">
          Dashboard
        </NavLink>

        <NavLink to="/accounts">
          Accounts
        </NavLink>

        <NavLink to="/accounts/create">
          Create Account
        </NavLink>

        <NavLink to="/transfer">
          Transfer Money
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;
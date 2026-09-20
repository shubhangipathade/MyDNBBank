import { useNavigate } from "react-router-dom";

function Header({ user, onLogout }) {

  const navigate = useNavigate();

  const handleLogout = () => {

    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    onLogout();

    navigate("/login");
  };

  return (
    <header className="header">

      <div className="header-left">

        <h2>
          MyBank
        </h2>

      </div>

      <div className="header-right">

        {user && (
          <div className="user-info">

            <div className="user-details">

              <strong>
                {user.fullName}
              </strong>

              <span>
                {user.username}
              </span>

            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;
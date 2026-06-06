import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_URI = process.env.REACT_APP_API_URL;

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URI}/login`, 
        {
          email,
          password,
        }
      );

      if (response.data.status === "ok") {
        setSuccess("Registration successful! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card p-4"
        style={{
          width: "400px",
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          borderRadius: "10px",
        }}
      >
        <div className="card-body">
          <h1 className="card-title text-center">
            Register
          </h1>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control mt-3"
                placeholder="Email"
                required
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control mt-3"
                placeholder="Password"
                required
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control mt-3"
                placeholder="Confirm Password"
                required
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-success btn-block mt-3"
            >
              Register
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                marginLeft: "5px",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

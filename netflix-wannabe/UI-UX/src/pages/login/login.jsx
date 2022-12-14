import { useState } from "react";
import { Link } from 'react-router-dom';

import './login.scss';
// import { AuthContext } from "../../authContext/AuthContext";
// import { login } from "../../authContext/apiCall";
import { checkLogin, forgotPassword } from "../../actions/index";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const {dispatch} = useContext(AuthContext);
  const [forgot, setForgot] = useState(false);
  const [data, setData] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [url, setUrl] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // login({ email, password }, dispatch);
    checkLogin({ email, password })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data));
          window.location.href = "/";
        } else if (res.data.code === 23) {
          setSendStatus(res.data.message);
          setUrl(res.data.result.url)
        } else {
          setSendStatus(res.data);
        }
    })
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setData({ ...data, [e.target.name]: value });
  };

  const handleForgot = (e) => {
    e.preventDefault();
    forgotPassword(data)
      .then(res => {
        var item = res.data;
        const object = item.result;
        if (res.status === 200) {
          localStorage.setItem("data", JSON.stringify(object));
          window.location.href = object.link;
        } else if (res.status === 400) {
          setSendStatus(res.data);
        }
    })
  };

  return (
    <div className="loginForm">
      <div className="headerLogin">
        <div className="wrapperLogin">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="containerLogin">
        <form className="formLogin">
          {forgot === false ? (
            <>
              <h1>Sign In</h1>
              {sendStatus ? 
                <p className="loginStatus">{sendStatus}</p>
                : 
                null 
              }
              {url ? <a className="re-sub" href={url}>Re-subscribes!</a> : null}
              <input 
                className="inputLogin"
                type="email"
                placeholder="Email or phone number"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="inputLogin"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="loginButton" onClick={handleLogin}>
                Sign In
              </button>
              <span className="forgotLogin">
                <button className="forgot" onClick={() => setForgot(!forgot)}>Need help?</button>
              </span>
              <span className="breifLogin">
                New to Netflix? 
                <Link to="/register" className="signUp"><b> Sign up now.</b></Link>
              </span>
            </>
          ) 
          : (
            <>
              <h1 style={{ fontSize: '30px', textAlign: 'center', marginBottom: '-20px' }}>Forgot Password</h1>
              {sendStatus ? <p className="status">{sendStatus}</p> : null }
              <input
                className="inputLogin"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                name="email"
              />
              <button className="sendBtn" onClick={handleForgot}>
                Send
              </button>
            </>
          )}
          
          <small className="policy">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <b>Learn more</b>.
          </small>
        </form>
      </div>
    </div>
  );
}

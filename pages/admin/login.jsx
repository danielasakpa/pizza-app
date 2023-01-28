import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Login.module.css";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  // use the useRouter hook to handle client-side routing
  const router = useRouter();

  // function to handle the login request
  const handleClick = async () => {
    try {
      // send a post request to the server with the login credentials
      await axios.post(`${process.env.API_ENDPOINT}/api/login`, {
        username,
        password,
      });
      // navigate to the admin dashboard
      router.push("/admin");
    } catch (err) {
      // display an error message if the login fails
      console.log(err);
      toast.error("Wrong Credentials!");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Admin Dashboard</h1>
        <input
          placeholder="username"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleClick} className={styles.button}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;

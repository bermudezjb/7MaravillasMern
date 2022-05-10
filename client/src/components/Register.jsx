import e from "cors";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const signUp = async () => {
      const url = "api/v1/users/signup";
      await axios.post(url, { name, email, password, passwordConfirm });
    };
    signUp();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form__name"
          placeholder="Nombre"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="form__email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form__password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="form__password"
          placeholder="Contraseña"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form__passwordConfirm"
          placeholder="Confirma la contraseña"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <input type="submit" className="button" />
      </form>
    </div>
  );
};

export default Register;

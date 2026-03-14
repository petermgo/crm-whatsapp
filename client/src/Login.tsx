import { useState } from "react"

export default function Login({ onLogin }: any) {

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function login() {

    if (user === "pedro" && pass === "1234") {

      onLogin()

    } else {

      alert("Usuário ou senha inválidos")

    }

  }

  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial"
      }}
    >

      <div
        style={{
          border: "1px solid #ccc",
          padding: 40,
          borderRadius: 8,
          width: 300
        }}
      >

        <h2>Login CRM</h2>

        <input
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 10,
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >

          Entrar

        </button>

      </div>

    </div>

  )

}
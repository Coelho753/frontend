import './style.css'
import { useEffect, useState, useRef } from 'react'
import api from '../../services/api.js'

function Home() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')
    setUsers(usersFromApi.data)
  }

  async function createUsers() {
    const name = inputName.current.value.trim()
    const age = inputAge.current.value.trim()
    const email = inputEmail.current.value.trim()

    // ✅ Validação simples no front-end
    if (!name || !age || !email) {
      setError("Todos os campos são obrigatórios!")
      setSuccess("")
      return
    }

    try {
      await api.post('/usuarios', { name, age, email })
      setSuccess("Usuário cadastrado com sucesso!")
      setError("")
      inputName.current.value = ""
      inputAge.current.value = ""
      inputEmail.current.value = ""
      getUsers()
    } catch (err) {
      console.error(err)
      setError("Erro ao cadastrar usuário.")
      setSuccess("")
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="container">
      <form>
        <h1>Cadastro</h1>
        <input placeholder="Nome" name='nome' type='text' ref={inputName} />
        <input placeholder="Idade" name='idade' type='number' ref={inputAge} />
        <input placeholder="Email" name='email' type="email" ref={inputEmail} />
        <button type="button" onClick={createUsers}>Cadastrar</button>

        {/* Mensagens de feedback */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Email: <span>{user.email}</span></p>
            <p>Idade: <span>{user.age}</span></p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home

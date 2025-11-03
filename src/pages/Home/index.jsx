import './style.css'
import { useEffect, useState, useRef } from 'react'
import api from '../../services/api.js'

function Home() {
  const [users, setUsers] = useState([])
  const [sexo, setSexo] = useState('')
  const [loading, setLoading] = useState(true)
  const inputName = useRef()
  const inputAge = useRef()
  const inputFaculdade = useRef()
  const inputMensagem = useRef()

  // 🔹 Busca inicial de usuários
  async function getUsers() {
    setLoading(true)
    const res = await api.get('/usuarios')
    setUsers(res.data)
    setLoading(false)
  }

  // 🔤 Deixa a primeira letra de cada palavra maiúscula
  function formatarNome(nome) {
    return nome
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ')
  }


  // 🔹 Cria novo usuário
  async function createUsers() {
    const name = formatarNome(inputName.current.value).trim()
    const age = inputAge.current.value.trim()
    const faculdade = formatarNome(inputFaculdade.current.value).trim()
    const mensagem = inputMensagem.current.value.trim()

    if (!name || !age || !sexo || !faculdade || !mensagem) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    await api.post('/usuarios', {
      name,
      age: Number(age),
      sexo,
      faculdade,
      mensagem
    })

    inputName.current.value = ''
    inputAge.current.value = ''
    inputFaculdade.current.value = ''
    inputMensagem.current.value = ''
    setSexo('')
    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])

  // 🎨 Atualiza variáveis de tema conforme o sexo selecionado
  useEffect(() => {
    const root = document.documentElement
    root.style.transition = 'all 0.6s ease'

    if (sexo === 'masculino') {
      root.style.setProperty('--bg-color', '#001f5f')
      root.style.setProperty('--primary-color', '#2563eb')
      root.style.setProperty('--accent-color', '#93c5fd')
    } else if (sexo === 'feminino') {
      root.style.setProperty('--bg-color', '#5f001f')
      root.style.setProperty('--primary-color', '#e11d48')
      root.style.setProperty('--accent-color', '#f9a8d4')
    } else if (sexo === 'outro') {
      root.style.setProperty('--bg-color', 'linear-gradient(120deg, #b91c1c, #1e3a8a)')
      root.style.setProperty('--primary-color', '#9333ea')
      root.style.setProperty('--accent-color', '#c4b5fd')
    } else {
      root.style.setProperty('--bg-color', '#000000')
      root.style.setProperty('--primary-color', '#2b2121ff')
      root.style.setProperty('--accent-color', '#d1d5db')
    }
  }, [sexo])

  // 🔹 Cores dos cards de usuários
  const getCardStyle = (sexo) => {
    const s = (sexo || '').toLowerCase()
    if (s === 'masculino')
      return { background: '#1e3a8a', color: '#fff' }
    if (s === 'feminino')
      return { background: '#b91c1c', color: '#fff' }
    return { background: 'linear-gradient(90deg, #b91c1c, #1e3a8a)', color: '#fff' }
  }

  return (
    <div className="container">
      <form className="form-main" onSubmit={(e) => e.preventDefault()}>
        <h1>Quem é Você?</h1>

        <input placeholder="Nome" ref={inputName} />
        <input placeholder="Idade" type="number" ref={inputAge} />

        <div className="sexo-selector">
          <label>
            <input
              type="radio"
              name="sexo"
              value="masculino"
              checked={sexo === 'masculino'}
              onChange={(e) => setSexo(e.target.value)}
            /> Masculino
          </label>
          <label>
            <input
              type="radio"
              name="sexo"
              value="feminino"
              checked={sexo === 'feminino'}
              onChange={(e) => setSexo(e.target.value)}
            /> Feminino
          </label>
          <label>
            <input
              type="radio"
              name="sexo"
              value="outro"
              checked={sexo === 'outro'}
              onChange={(e) => setSexo(e.target.value)}
            /> Outro
          </label>
        </div>

        <input placeholder="Faculdade / Curso" ref={inputFaculdade} />
        <textarea placeholder="Mensagem" ref={inputMensagem}></textarea>

        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>


      <div className="cards-list">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando usuários...</p>
          </div>
        ) : users.length === 0 ? (
          <p className="no-users">Nenhum usuário cadastrado ainda.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="card fade-in" style={getCardStyle(user.sexo)}>
              <div>
                <h2>{user.name}</h2>
                <p><strong>Idade:</strong> {user.age}</p>
                <p><strong>Sexo:</strong> {user.sexo}</p>
                <p><strong>Faculdade:</strong> {user.faculdade}</p>
                <p><strong>Mensagem:</strong> {user.mensagem}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Home

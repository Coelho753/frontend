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

  // 🔤 Capitaliza a primeira letra de cada palavra
  function capitalizarTexto(texto) {
    return texto
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ')
  }

  // ✂️ Abrevia nomes do meio, mantendo o primeiro e último completos
  function abreviarNomeCompleto(nome) {
    const partes = nome.trim().split(/\s+/)
    const qtd = partes.length

    if (qtd <= 3) return nome // nomes curtos ficam completos

    const primeiroNome = partes[0]
    const primeiroSobrenome = partes[1]
    const ultimoSobrenome = partes[qtd - 1]

    const nomesDoMeio = partes.slice(2, -1).map(p => {
      if (["da", "de", "do", "dos", "das"].includes(p.toLowerCase())) {
        return p.toLowerCase() + '.'
      }
      return p[0].toUpperCase() + '.'
    })

    return `${primeiroNome} ${primeiroSobrenome} ${nomesDoMeio.join(' ')} ${ultimoSobrenome}`
  }

  // 🔄 Busca usuários do backend
  async function getUsers() {
    try {
      setLoading(true)
      const res = await api.get('/usuarios')
      setUsers(res.data)
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  // 🧩 Cria novo usuário
  async function createUsers() {
    const name = capitalizarTexto(inputName.current.value)
    const age = inputAge.current.value.trim()
    const faculdade = capitalizarTexto(inputFaculdade.current.value)
    const mensagem = capitalizarTexto(inputMensagem.current.value)

    // 🛑 Validação da idade
    if (!/^\d+$/.test(age) || Number(age) <= 0) {
      alert('Por favor, insira uma idade válida (somente números positivos).')
      return
    }

    if (!name || !sexo || !faculdade || !mensagem) {
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

  // 🎨 Atualiza tema conforme o sexo
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    root.style.transition = 'all 0.6s ease'

    if (sexo === 'masculino') {
      body.setAttribute('tema', 'masculino')
      root.style.setProperty('--bg-color', '#001f5f')
      root.style.setProperty('--primary-color', '#2563eb')
      root.style.setProperty('--accent-color', '#60a5fa')
    } else if (sexo === 'feminino') {
      body.setAttribute('tema', 'feminino')
      root.style.setProperty('--bg-color', '#5f001f')
      root.style.setProperty('--primary-color', '#e11d48')
      root.style.setProperty('--accent-color', '#f9a8d4')
    } else if (sexo === 'outro') {
      body.setAttribute('tema', 'outro')
      root.style.setProperty('--bg-color', 'linear-gradient(120deg, #b91c1c, #1e3a8a)')
      root.style.setProperty('--primary-color', '#9333ea')
      root.style.setProperty('--accent-color', '#c084fc')
    } else {
      body.setAttribute('tema', 'default')
      root.style.setProperty('--bg-color', '#000')
      root.style.setProperty('--primary-color', '#2b2121ff')
      root.style.setProperty('--accent-color', '#d1d5db')
    }
  }, [sexo])

  useEffect(() => {
    getUsers()
  }, [])

  const getCardStyle = (sexo) => {
    const s = (sexo || '').toLowerCase()
    if (s === 'masculino') return { background: '#1e3a8a', color: '#fff' }
    if (s === 'feminino') return { background: '#b91c1c', color: '#fff' }
    return { background: 'linear-gradient(90deg, #b91c1c, #1e3a8a)', color: '#fff' }
  }

  return (
    <div className="container">
      <form className="form-main" onSubmit={(e) => e.preventDefault()}>
        <h1>Cadastro</h1>

        <input
          placeholder="Nome"
          ref={inputName}
        />

        <input
          placeholder="Idade"
          type="text"
          ref={inputAge}
          onChange={(e) => {
            // ✋ Bloqueia letras e caracteres especiais
            const apenasNumeros = e.target.value.replace(/[^0-9]/g, '')
            e.target.value = apenasNumeros
          }}
        />

        <div className="sexo-selector">
          <label>
            <input type="radio" name="sexo" value="masculino" checked={sexo === 'masculino'} onChange={(e) => setSexo(e.target.value)} /> Masculino
          </label>
          <label>
            <input type="radio" name="sexo" value="feminino" checked={sexo === 'feminino'} onChange={(e) => setSexo(e.target.value)} /> Feminino
          </label>
          <label>
            <input type="radio" name="sexo" value="outro" checked={sexo === 'outro'} onChange={(e) => setSexo(e.target.value)} /> Outro
          </label>
        </div>

        <input placeholder="Faculdade / Curso" ref={inputFaculdade} />
        <textarea placeholder="Mensagem" ref={inputMensagem}></textarea>

        <button type="button" onClick={createUsers}>Cadastrar</button>
      </form>

      <div className="cards-list">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando usuários...</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="card" style={getCardStyle(user.sexo)}>
              <div>
                <h2 title={user.name}>{abreviarNomeCompleto(user.name)}</h2>
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

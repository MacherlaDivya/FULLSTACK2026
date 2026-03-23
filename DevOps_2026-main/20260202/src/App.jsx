import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [animation, setAnimation] = useState('')
  const [particles, setParticles] = useState([])

  const createParticles = (type) => {
    const newParticles = []
    const particleCount = 20
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        type: type,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 0.1
      })
    }
    
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
  }

  const increment = () => {
    setCount(count + 1)
    setAnimation('increment')
    createParticles('increment')
    setTimeout(() => setAnimation(''), 300)
  }
  
  const decrement = () => {
    setCount(count - 1)
    setAnimation('decrement')
    createParticles('decrement')
    setTimeout(() => setAnimation(''), 300)
  }
  
  const reset = () => {
    setCount(0)
    setAnimation('reset')
    createParticles('reset')
    setTimeout(() => setAnimation(''), 300)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowUp') {
        increment()
      } else if (event.key === 'ArrowDown') {
        decrement()
      } else if (event.key === 'r' || event.key === 'R') {
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [count])

  return (
    <div className="app">
      <div className="counter-container">
        <h1>Counter App</h1>
        <div className="counter-display">
          <span className={`count ${animation}`}>{count}</span>
          <div className="particles-container">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={`particle particle-${particle.type}`}
                style={{
                  '--x': `${particle.x}px`,
                  '--y': `${particle.y}px`,
                  '--size': `${particle.size}px`,
                  '--duration': `${particle.duration}s`,
                  '--delay': `${particle.delay}s`
                }}
              />
            ))}
          </div>
        </div>
        <div className="button-group">
          <button onClick={decrement} className="btn btn-decrement">
            -
          </button>
          <button onClick={reset} className="btn btn-reset">
            Reset
          </button>
          <button onClick={increment} className="btn btn-increment">
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <h1 class="text-3xl font-bold underline text-blue-600 bg-yellow-200 p-4 border-4 border-green-500">
  Hello world!
</h1>

    </>
  )
}

export default App

import { createContext, useContext, useEffect, useState } from 'react'

// 1. Define proper context shape with default values
const ColorblindContext = createContext({
  colorblind: null,
  changeColorblind: (_) => {}
})

const useColorblind = () => useContext(ColorblindContext)

const ColorblindProvider = ({ children }) => {
  const [colorblind, setColorblind] = useState(null)
  const [mounted, setMounted] = useState(false)

  // 2. Fix useEffect dependencies
  useEffect(() => {
    setColorblind(localStorage.getItem('colorblind'))
    setMounted(true)
  }, []) // Empty dependency array for initial setup only

  // 3. Update class list after mount
  useEffect(() => {
    if (!mounted) return
    
    const html = document.documentElement
    html.classList.remove(
      'default',
      'protanopia',
      'deuteranopia',
      'tritanopia',
      'achromatopsia'
    )
    
    if (colorblind) {
      html.classList.add(colorblind)
      localStorage.setItem('colorblind', colorblind)
    } else {
      localStorage.removeItem('colorblind')
    }
  }, [colorblind, mounted])
  
  // Expose the state setter with correct name
  const changeColorblind = (colorblind) => {
    setColorblind(colorblind.colorblind)
  }

  // 4. Always render provider (remove null return)
  return (
    <ColorblindContext.Provider value={{ colorblind, changeColorblind }}>
      {children}
    </ColorblindContext.Provider>
  )
}

export { ColorblindProvider, useColorblind }
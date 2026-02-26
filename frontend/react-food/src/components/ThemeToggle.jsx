import React, { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [theme, setTheme] = useState(() => {
    try{
      return localStorage.getItem('theme')
    }catch(e){
      return null
    }
  })

  useEffect(()=>{
    const root = window.document.documentElement
    if(theme === 'light') root.setAttribute('data-theme','light')
    else if(theme === 'dark') root.setAttribute('data-theme','dark')
    else root.removeAttribute('data-theme')
    try{ localStorage.setItem('theme', theme || '') }catch(e){}
  },[theme])

  // initialize to system if not set
  useEffect(()=>{
    if(theme) return
    try{
      const stored = localStorage.getItem('theme')
      if(stored) setTheme(stored)
    }catch(e){}
  }, [])

  function toggle(){
    // cycle: null (system) -> light -> dark -> system
    if(!theme) setTheme('light')
    else if(theme === 'light') setTheme('dark')
    else setTheme(null)
  }

  const label = theme === 'light' ? '☀️' : '🌙';

  return (
    <button className="theme-toggle" onClick={toggle} title="Toggle theme">
      {label}
    </button>
  )
}

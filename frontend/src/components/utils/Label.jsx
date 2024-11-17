import React from 'react'

function Label({label}) {
  return (
    <label className="text-sm font-medium text-white dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
  )
}

export default Label
import React from 'react'

function Button({children,type="button",textColor="text-black",className='',...props},ref) {
  return (
    <button ref={ref} type={type} className={`px-4  py-2 rounded-lg ${textColor}  ${className}`} {...props} > {children} </button>
  )
}

export default React.forwardRef(Button)
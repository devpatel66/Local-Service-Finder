import React,{useId} from 'react'


const Input = React.forwardRef(function Input({label,type="text",className="",...props},ref) {
    const id = useId();
    return (
        <div className='w-full'>
            {label && <label className='font-medium' htmlFor={id}>{label}</label>}
            <input 
            ref={ref}
            type={type} 
            id={id} 
            className={`w-full  h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`} 
            {...props} />
        </div>
    )
}
)

export default Input
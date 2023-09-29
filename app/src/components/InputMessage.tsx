import React, { useState } from 'react';


export interface Props  {
  onEnter: (content:string) => void
  disabled?: boolean
}

function InputMessage({onEnter, disabled}: Props) {
  const [value, setValue] = useState<string>("");
  
  function trigger(key: React.KeyboardEvent) {
    if (key.code === "Enter") {
      onEnter(value);
      setValue("");
    }
  }

 

  return (
    <>        
    <div className=" relative ">
      <input type="text" id="rounded-email" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-0 focus:ring-purple-600 focus:border-transparent"
       disabled={disabled ?? true} placeholder="Type here..." value={value} onChange={(x) => setValue(x.target.value)} onKeyUp={(x) => trigger(x)}/>
    </div>

    </>
  )
}

export default InputMessage;


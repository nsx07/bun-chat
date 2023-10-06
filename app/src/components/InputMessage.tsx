import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { ArrowCircleRight } from 'phosphor-react';


export interface Props  {
  onChange?: (content:string) => void
  onEnter?: (content:string) => void
  initialValue?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  inputId?: string
}

function InputMessage({onEnter, disabled, placeholder, onChange, value, initialValue, inputId}: Props) {
  const [_value, _setValue] = useState<string>(initialValue ?? "");
  const [rows, setRows] = useState<number>(1);
  
  function trigger(key: React.KeyboardEvent) {
    if (key.code === "Enter" && onEnter) {
      dispatchValue();
      
    } else {
      let rows = 1;
      
      if (key) {
        const scroll = key.currentTarget.scrollHeight;
        rows = Math.min(Math.ceil(scroll / 24), 3);
      }
    }


    setRows(_value.length > 1 ? rows : 1);
  }

  function dispatchValue() {
    if (onEnter) {
      _setValue(""); 
      onEnter(_value);
    }
  }

  useEffect(() => {
    _setValue(value!);
    if (value && value !== _value) {
    }
  }, [value]);

  return (
    <>        
    
      <div className={clsx("relative flex items-center max-w-full py-2 pl-4 pr-2 rounded-lg bg-white border-gray-300", { disabled: "opacity-60" })}>
        
        <textarea id={inputId}
          
          rows={rows}
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? "Type here..."}
          
          onLoad={() => setRows(1)}
          onKeyUp={(x) => trigger(x)}
          onChange={(x) => {
            _setValue(x.target.value.replace("\n", ""))
            onChange && onChange(_value)
          }}
          
          className="resize-none border-transparent bg-transparent flex-1 appearance-none border text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:ring-0 focus:ring-purple-600 focus:border-transparent"
          />
        
        <div className={clsx("rounded-lg right-1 cursor-pointer", { 'text-slate-600': !disabled, 'text-gray-500': disabled })}>
          <ArrowCircleRight size={28} onClick={() => dispatchValue()}/>
        </div>
        
      </div>

    </>
  )
}

export default InputMessage;


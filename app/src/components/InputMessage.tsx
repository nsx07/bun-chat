import clsx from 'clsx';
import React, { useState } from 'react';
import { ArrowCircleRight } from 'phosphor-react';
import { validInputText } from '../utils/utils';


export interface Props  {
  onEnter?: (content:string) => void
  onChange?: (content:string) => void
  initialValue?: string
  placeholder?: string
  disabled?: boolean
  ref?: string
  inputId?: string
}

function InputMessage({onEnter, disabled, placeholder, ref, onChange, initialValue, inputId}: Props) {
  const [value, setValue] = useState<string>(initialValue ?? "");
  const [rows, setRows] = useState<number>(1);
  
  function trigger(key: React.KeyboardEvent) {
    ref = value;
    if (key.code === "Enter" && onEnter) {
      dispatchValue();
      onChange_();
    }
  }

  function dispatchValue() {
    if (onEnter && validInputText(value)) {
      setValue(""); 
      onEnter(value);
    }
  }

  function onChange_(ev?: React.KeyboardEvent) {
    let rows = 1;
    
    if (ev) {
      const scroll = ev.currentTarget.scrollHeight;
      rows = Math.min(Math.ceil(scroll / 24), 3);
    }

    setRows(value.length > 1 ? rows : 1);

    if (onChange) {
      onChange(value);
    }
  }
 

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
            setValue(x.target.value.replace("\n", ""))
            onChange && onChange(value)
          }}
          
          className="resize-none border-transparent bg-transparent flex-1 appearance-none border text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:ring-0 focus:ring-purple-600 focus:border-transparent"
          />
        
        <div className={clsx("rounded-lg right-1 cursor-pointer text-slate-600", { 'opacity-60': disabled || !validInputText(value) })}>
          <ArrowCircleRight size={28} onClick={() => validInputText(value) && dispatchValue()}/>
        </div>
        
      </div>

    </>
  )
}

export default InputMessage;


import React, { CSSProperties, useState } from 'react';


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

  const style: CSSProperties = {
    backgroundColor: "#eeeeee",
    opacity: disabled ? "0.5" : "1",
    border: "none",
    padding: "0.8rem 0.2rem",
    fontSize: "1rem",
    width: "100%",
    color: "#1f1f1f",
    borderRadius: "0.3rem",
    cursor: "pointer",
  }

  return (
    <>
        <input disabled={disabled ?? true} style={style} placeholder="Type here..." value={value} onChange={(x) => setValue(x.target.value)} onKeyUp={(x) => trigger(x)}/>
    </>
  )
}

export default InputMessage;


import React, { CSSProperties, useState } from 'react';

export interface Props {
  onEnter: (content:string) => void
}

function InputMessage({onEnter}: Props) {
  const [value, setValue] = useState<string>("");
  
  function trigger(key: React.KeyboardEvent) {
    if (key.code === "Enter") {
      onEnter(value);
    }
  }

  return (
    <>
      <div style={{outlineColor: "lightcoral"}}>
        <input type="text" style={style} placeholder="Type here..." name="text" className="input" onChange={(x) => setValue(x.target.value)} onKeyUp={(x) => trigger(x)}/>
      </div>
    </>
  )
}

export default InputMessage;

const style: CSSProperties = {
  backgroundColor: "#eee",
  border: "none",
  padding: "1rem",
  fontSize: "1rem",
  width: "13em",
  borderRadius: "1rem",
  color: "lightcoral",
  boxShadow: "0 0.4rem #dfd9d9",
  cursor: "pointer",
}
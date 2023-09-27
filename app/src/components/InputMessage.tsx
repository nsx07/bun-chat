import React, { CSSProperties, useState } from 'react';

export interface Props {
  onEnter: (content:string) => void
}

function InputMessage({onEnter}: Props) {
  const [value, setValue] = useState<string>("");
  
  function trigger(key: React.KeyboardEvent) {
    if (key.code === "Enter") {
      onEnter(value);
      setValue("");
    }
  }

  return (
    <>
      <div style={{outlineColor: "lightcoral"}}>
        <input style={style} placeholder="Type here..." value={value} onChange={(x) => setValue(x.target.value)} onKeyUp={(x) => trigger(x)}/>
      </div>
    </>
  )
}

export default InputMessage;

const style: CSSProperties = {
  backgroundColor: "#eeeeee",
  border: "none",
  padding: "1rem",
  fontSize: "1rem",
  width: "100%",
  color: "#1f1f1f",
  borderRadius: "0.6rem",
  cursor: "pointer",
}
import clsx from 'clsx';
import { ArrowCircleRight } from 'phosphor-react';
import { ChangeEvent } from 'react';
import { validInputText } from '../utils/utils';

export interface Props {
    icon?: boolean
    valor?: string
    disabled?: boolean
    inputId?: string
    onEnter?: (content:string) => void
    onChange?: (valor: string) => void

}

function InputText({ valor, onChange, onEnter, icon = true, disabled, inputId }: Props) {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const novoValor = event.target.value;

    if (onChange) {
      onChange(novoValor);
    }
  };

  function trigger(key: React.KeyboardEvent) {
    if (key.code === "Enter" && onEnter && validInputText(valor!)) {
      dispatchValue();
    }
  }

  function dispatchValue() {
    if (onEnter && !disabled) {
      onEnter(valor!);
    }
  }

  return (
    <div className={clsx("relative flex items-center max-w-full py-2 pl-4 pr-2 rounded-lg bg-white border-gray-300", { disabled: "opacity-60" })}>

        <input
        type="text"
        id={inputId}
        value={valor}
        disabled={disabled}
        onChange={handleChange}
        onKeyUp={(x) => trigger(x)}
        className="resize-none border-transparent bg-transparent flex-1 appearance-none border text-gray-700 placeholder-gray-400 text-base focus:outline-none focus:ring-0 focus:ring-purple-600 focus:border-transparent"
        placeholder="Type here..."/>

        {
            icon && (
              <div className={clsx("rounded-lg right-1 cursor-pointer text-slate-600", { 'opacity-60': disabled || !validInputText(valor!) })}>
                <ArrowCircleRight size={28} onClick={() => validInputText(valor!) && dispatchValue()}/>
              </div>  
            )
        }

    </div>
  );
}

export default InputText;

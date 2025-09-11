import React from 'react'

const Switch = ({id ,checked , setsettings }) => {

    const handleSettingChange = (setting, value) => {
        setsettings(prev => ({ ...prev, [setting]: value }));
    };
  return (
    <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => handleSettingChange(id,!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300  ${
        checked ? 'bg-blue-600' : 'bg-white/20'
    } `}
>
    <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
            checked ? 'translate-x-6' : 'translate-x-1'
        }`}
    />
</button>
  )
}

export default Switch
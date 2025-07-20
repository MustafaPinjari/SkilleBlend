"use client"

import type React from "react"

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  icon,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        {icon && <div className="text-gray-600 flex-shrink-0">{icon}</div>}
        <div>
          <div className="font-medium text-gray-900">{label}</div>
          {description && <div className="text-sm text-gray-500">{description}</div>}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label}`}
        disabled={disabled}
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? "bg-blue-600" : "bg-gray-200"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  )
}

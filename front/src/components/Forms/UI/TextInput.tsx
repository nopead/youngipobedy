import React from 'react';
import '../../../styles/CommonForm.scss';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  type?: string;
  pattern?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  autoComplete,
  error,
  type = 'text',
  pattern,
  inputMode
}) => (
  <div className="input-group">
    <label>
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={error ? 'input-error' : ''}
        pattern={pattern}
        inputMode={inputMode}
      />
      {error && <div className="error-message">{error}</div>}
    </label>
  </div>
);

export default TextInput;
import React from 'react';
import '../../../styles/CommonForm.scss';

interface DateInputGroupProps {
  label: string;
  prefix: 'birth' | 'death';
  values: {
    day?: number | null;
    month?: number | null;
    year?: number | null;
  };
  errors: {
    day?: string;
    month?: string;
    year?: string;
    date?: string;
  };
  onChange: (prefix: 'birth' | 'death', part: 'day' | 'month' | 'year', value: string) => void;
}

const DateInputGroup: React.FC<DateInputGroupProps> = ({ 
  label, 
  prefix, 
  values, 
  errors, 
  onChange 
}) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="date-row">
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        placeholder="День"
        value={values.day ?? ''}
        onChange={(e) => onChange(prefix, 'day', e.target.value)}
        className={errors.day ? 'input-error' : ''}
      />
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        placeholder="Месяц"
        value={values.month ?? ''}
        onChange={(e) => onChange(prefix, 'month', e.target.value)}
        className={errors.month ? 'input-error' : ''}
      />
      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        placeholder="Год"
        value={values.year ?? ''}
        onChange={(e) => onChange(prefix, 'year', e.target.value)}
        className={errors.year ? 'input-error' : ''}
      />
    </div>
    {errors.day && <div className="error-message">{errors.day}</div>}
    {errors.month && <div className="error-message">{errors.month}</div>}
    {errors.year && <div className="error-message">{errors.year}</div>}
    {errors.date && <div className="error-message">{errors.date}</div>}
  </div>
);

export default DateInputGroup;
import { ChangeEvent, useState } from 'react';

type FormState = { [key: string]: string | number | boolean | Date };

export function useForm<T extends FormState>(initialState: T) {
  const [formState, setFormState] = useState<T>(initialState);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { type, name, checked, value } = event.target;
    const isCheckbox = type === 'checkbox';
    setFormState(prevState => ({
      ...prevState,
      [name]: isCheckbox
        ? checked
        : type === 'number'
        ? +value
        : type === 'date'
        ? new Date(value)
        : value,
    }));
  };

  return { formState, handleChange };
}

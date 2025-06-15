export interface FormDataType {
    surname: string;
    name: string;
    patronymic: string;
    birth_day?: number | null;
    birth_month?: number | null;
    birth_year?: number | null;
    death_day?: number | null;
    death_month?: number | null;
    death_year?: number | null;
    admission: string;
    biography: string;
    photo: File | null;
    photo_url: string;
    additional_information?: string;
    user_fullname?: string;
    user_email?: string;
  }
  
  export interface SailorFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<FormDataType>;
    onSubmit?: (data: FormDataType) => Promise<void>;
    showSenderFields?: boolean;
    disabled?: boolean;
  }
  
  export interface FormErrors {
    surname?: string;
    name?: string;
    patronymic?: string;
    admission?: string;
    biography?: string;
    photo_url?: string;
    user_fullname?: string;
    user_email?: string;
  
    birth_day?: string;
    birth_month?: string;
    birth_year?: string;
    birth_date?: string;
    death_day?: string;
    death_month?: string;
    death_year?: string;
    death_date?: string;
  }
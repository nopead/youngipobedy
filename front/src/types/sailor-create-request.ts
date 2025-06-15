export interface SailorRequest {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    photo_url: string;
    birth_day: number | null;
    birth_month: number | null;
    birth_year: number | null;
    death_day: number | null;
    death_month: number | null;
    death_year: number | null;
    admission: number;
    biography: string | null;
    user_fullname: string;
    user_email: string;
    additional_information: string | null;
    created_at: string;
  }
  
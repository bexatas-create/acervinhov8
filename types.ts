
export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  subject: string;
  description?: string;
}

export interface SubjectSection {
  title: string;
  courses: Course[];
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

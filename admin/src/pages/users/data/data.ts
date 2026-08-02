export interface IUser {
  id: number
  uuid: string
  firstname: string
  lastname: string
  phone: number
  email: string
  gender: string
  profession: string
  graduation_year: number
  place_of_study?: string
  interests: string
  birthday: string
  address?: string
  image: string
  role: string
  status: number
}

export const users = [
  {
    id: 1,
    uuid: 'some_uuid_1',
    firstname: 'John',
    lastname: 'Doe',
    phone: 1234567890,
    email: 'johndoe@example.com',
    gender: 'Male',
    profession: 'Engineer',
    graduation_year: 2020,
    place_of_study: 'XYZ University',
    interests: 'Reading, Sports',
    birthday: '1990-01-01',
    address: '123 Main St, City',
    image: 'profile_image_1.jpg',
    role: 'User',
    status: 1
  },
  // Boshqa ma'lumotlar uchun yana obyekt qo'shing
  {
    id: 2,
    uuid: 'some_uuid_2',
    firstname: 'Jane',
    lastname: 'Smith',
    phone: 9876543210,
    email: 'janesmith@example.com',
    gender: 'Female',
    profession: 'Teacher',
    graduation_year: 2018,
    place_of_study: 'ABC College',
    interests: 'Music, Travel',
    birthday: '1985-05-15',
    address: '456 Elm St, Town',
    image: 'profile_image_2.jpg',
    role: 'User',
    status: 1
  }
  // Yana ma'lumotlar qo'shishing...
]

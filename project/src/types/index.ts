export interface BusinessRegistration {
  id?: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  business_type: string
  company_size: string
  address: string
  city: string
  state: string
  pincode: string
  gst_number?: string
  license_number?: string
  website?: string
  description?: string
  created_at?: string
}

export interface WorkerRegistration {
  id?: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  skills: string[]
  experience_years: number
  education_level: string
  availability?: string
  languages: string[]
  has_vehicle: boolean
  emergency_contact_name: string
  emergency_contact_phone: string
  aadhar_number: string
  work_description?: string
  created_at?: string
}
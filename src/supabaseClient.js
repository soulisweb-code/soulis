import { createClient } from '@supabase/supabase-js'

// Vite ต้องเรียกใช้ตัวแปรด้วยคำสั่ง import.meta.env และต้องมี VITE_ นำหน้า
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
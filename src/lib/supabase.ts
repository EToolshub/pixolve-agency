import { createClient } from "@supabase/supabase-js";

// La URL y la clave pública ("publishable") están pensadas para exponerse
// en el cliente: el acceso real está protegido por Row Level Security en
// Supabase (la tabla "subscribers" solo permite inserciones, nunca lectura).
const SUPABASE_URL = "https://gqjptrcvkbzotzserdop.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dstVrKuYhGngxh4wQisgpg_yvx4XEST";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

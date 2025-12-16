import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tceosvhwhzkvznbrrcrc.supabase.co";
const supabaseKey = "sb_publishable_fCYYdifSOHt23RgzP4kwcA_oN5Gmuat"; // your publishable key
export const supabase = createClient(supabaseUrl, supabaseKey);

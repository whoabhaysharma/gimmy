import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

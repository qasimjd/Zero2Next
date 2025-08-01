import  StartupForm  from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <>
      <section className="green_container !min-h-[200px] sm:!min-h-[230px] px-4 sm:px-10">
        <h1 className="heading">Submit Your Startup</h1>
      </section>

      <div className="px-4 sm:px-6 lg:px-8">
        <StartupForm />
      </div>
    </>
  );
};

export default Page;
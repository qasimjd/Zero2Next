import Link from "next/link";
import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import LogoutConfirmationDialog from "./ui/LogoutConfirmationDialog";

const Navbar = async () => {
  const session = await auth();
  const user = session?.user;

  const handleLogout = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <header className="sticky top-0 z-50 px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="transition-transform hover:scale-105">
          <h1 className="text-2xl font-bold flex items-center">
            Zero2
            <span className="text-primary ml-1">Next</span>
            <TrendingUp size={24} className="text-primary ml-0.5" />
          </h1>
        </Link>

        <div className="flex items-center gap-4 text-black">
          {user ? (
            <>
              <Link
                href="/startup/create"
                className="hover:opacity-80 transition-opacity"
                aria-label="Create startup"
              >
                <Button variant="default" className="max-sm:hidden text-white">
                  <BadgePlus className="size-4 mr-2" />
                  Create
                </Button>
                <BadgePlus className="size-6 sm:hidden text-primary" />
              </Link>

              <div className="flex items-center gap-2">
                <Link href={`/user/${session?.id}`} className="hover:opacity-90 transition-opacity">
                  <Avatar className="size-10 border-2 border-primary/20">
                    <AvatarImage
                      src={user.image || "/avatar.png"}
                      alt={`${user.name || "User"}'s profile`}
                    />
                    <AvatarFallback>{user.name?.substring(0, 2) || "UN"}</AvatarFallback>
                  </Avatar>
                </Link>

                <LogoutConfirmationDialog onConfirm={handleLogout}>
                  <Button
                    variant="ghost"
                    className="max-sm:p-1 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 p-2 rounded-lg"
                    aria-label="Logout"
                  >
                    <LogOut className="size-5 sm:ml-2 max-sm:text-red-500" />
                  </Button>
                </LogoutConfirmationDialog>
              </div>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <Button
                type="submit"
                className="font-medium hover:opacity-90 transition-opacity text-white"
                aria-label="Login with GitHub"
              >
                Login
              </Button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
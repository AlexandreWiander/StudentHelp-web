import { useCallback } from "react";
import { signOut } from "next-auth/react";

function LogOutButton() {
  const logout = useCallback(async (event: any) => {
    localStorage.removeItem("JWT");
    localStorage.removeItem("fullName");
    signOut({ callbackUrl: "/connection" });
  }, []);

  return (
    <>
      <form onSubmit={(e) => logout(e)} className="self-center ml-auto">
        <button
          className="bg-white text-blueTheme rounded-full shadow-xl p-2 font-face-pg hover:scale-110 transition duration-500"
          type="submit"
        >
          Se déconnecter
        </button>
      </form>
    </>
  );
}
export default LogOutButton;

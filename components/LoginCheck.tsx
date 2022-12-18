import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function LoginCheck({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [fullName, setName] = useState(null);

  useEffect(() => {
    if (session == undefined && localStorage.getItem("fullName") == null) {
      if (
        router.pathname != "/connection" &&
        router.pathname != "/connection/register" &&
        router.pathname != "/contact"
      ) {
        router.push("/connection");
      }
    } else if (session != undefined && router.pathname == "/connection") {
      router.push("/");
    }

    if (
      session != undefined &&
      session.user?.image == undefined &&
      localStorage.getItem("fullName") == null
    ) {
      // J'utilise la ligne suivante car la propriété customToken est un prop. personnalisée. Ceci est utilisé pour ignorer l'erreur typescript
      // @ts-ignore
      localStorage.setItem("JWT", session?.customToken);
      const body = { id: session?.user?.name };

      fetch("/api/auth/name", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          const fullN = result.name;
          localStorage.setItem("fullName", fullN);
          setName(fullN);
        });
    } else if (
      session != undefined &&
      localStorage.getItem("fullName") == null
    ) {
      const body = { mail: session?.user?.email };
      fetch("/api/auth/googleGetToken", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          localStorage.setItem("JWT", result.token);
        });

      let fullNameGoogle = session.user?.name;
      if (fullNameGoogle != undefined) {
        localStorage.setItem("fullName", fullNameGoogle);
      }
    }
  }, [session, fullName]);

  return children;
}

export default LoginCheck;

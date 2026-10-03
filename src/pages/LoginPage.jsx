import { useEffect, useState } from "react";
import { signIn, signUp } from "../services/auth";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    document.title = "Entrar · Tareas";
  }, []);

  const isLogin = mode === "login";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const { data, error } = await (isLogin ? signIn : signUp)(email, password);
    setBusy(false);
    if (error) {
      setMessage({
        type: "error",
        text: isLogin
          ? "Correo o contraseña incorrectos."
          : "No se pudo crear la cuenta. Revisa el correo y usa al menos 6 caracteres.",
      });
    } else if (!isLogin && !data.session) {
      setMessage({ type: "ok", text: "Cuenta creada. Revisa tu correo para confirmarla y luego entra." });
    }
  };

  const field = "mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 font-normal hover:border-muted focus:border-accent";

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Tareas</h1>
      <p className="mt-2 text-muted">{isLogin ? "Entra para ver tu lista." : "Crea tu cuenta y empieza tu lista."}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm font-semibold">
          Correo electrónico
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Contraseña
          <input
            type="password"
            required
            minLength={6}
            value={password}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
        {message && (
          <p role="alert" className={`text-sm ${message.type === "error" ? "text-urgent" : "text-accent"}`}>
            {message.text}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-[#2342b8] disabled:opacity-60"
        >
          {busy ? "Un momento…" : isLogin ? "Entrar" : "Crear cuenta"}
        </button>
      </form>
      <button
        onClick={() => {
          setMode(isLogin ? "signup" : "login");
          setMessage(null);
        }}
        className="mt-6 self-start text-sm text-accent underline underline-offset-4 hover:text-ink"
      >
        {isLogin ? "No tengo cuenta: crear una" : "Ya tengo cuenta: entrar"}
      </button>
    </main>
  );
}

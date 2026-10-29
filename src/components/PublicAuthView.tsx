import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { NavbarPublic } from './NavbarPublic';
import { FerrofluidBackground } from './FerrofluidBackground';

export const PublicAuthView: React.FC = () => {
  const { login, register, theme } = useStore();
  const [currentTab, setCurrentTab] = useState<'login' | 'register' | 'contact'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sthephenandrew56@gmail.com');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [loginMessage, setLoginMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDireccion, setRegDireccion] = useState('');
  const [registerMessage, setRegisterMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginMessage({ text: 'Verificando credenciales...', isError: false });

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        setLoginMessage({ text: res.message, isError: false });
      } else {
        setLoginMessage({ text: res.message, isError: true });
      }
    } catch (err: any) {
      setLoginMessage({ text: 'Error de conexión. Inténtalo de nuevo.', isError: true });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regNombre || !regEmail || !regTelefono || !regPassword || !regDireccion) {
      setRegisterMessage({ text: 'Todos los campos son obligatorios.', isError: true });
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegisterMessage({ text: 'El formato del correo electrónico es inválido.', isError: true });
      return;
    }
    if (regPassword.length < 6) {
      setRegisterMessage({ text: 'La contraseña debe tener al menos 6 caracteres.', isError: true });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegisterMessage({ text: 'Las contraseñas no coinciden.', isError: true });
      return;
    }

    setIsRegistering(true);
    setRegisterMessage({ text: 'Procesando registro...', isError: false });

    try {
      const res = await register({
        nombre: regNombre,
        email: regEmail,
        telefono: regTelefono,
        direccion: regDireccion,
        password: regPassword
      });

      if (res.success) {
        setRegisterMessage({ text: res.message, isError: false });
        setTimeout(() => {
          setLoginEmail(regEmail);
          setLoginPassword(regPassword);
          setCurrentTab('login');
          setRegisterMessage(null);
        }, 1800);
      } else {
        setRegisterMessage({ text: res.message, isError: true });
      }
    } catch (err: any) {
      setRegisterMessage({ text: 'Error inesperado en el registro.', isError: true });
    } finally {
      setIsRegistering(false);
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans transition-all duration-300 ${
        isLight ? 'landing-light' : 'landing-dark'
      }`}
      style={{
        background: isLight
          ? 'linear-gradient(135deg, #F8F1E9 0%, #EDE0D0 100%)'
          : 'linear-gradient(135deg, #1C120C 0%, #352116 100%)',
        color: isLight ? '#2A1C15' : '#F8F1E9'
      }}
    >
      <FerrofluidBackground theme={theme} />

      <NavbarPublic currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        {/* LOGIN CONTAINER */}
        {currentTab === 'login' && (
          <div className="w-full max-w-[420px] mx-auto bg-black/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-[#B89778]/35 text-center animate-fade-in text-[#F8F1E9]">
            <img
              src="/cafe_vistro_logo.jpg"
              alt="Café Vistro"
              className="w-16 h-16 mx-auto mb-3 rounded-full border border-[#B89778]/60 shadow-lg object-cover"
            />
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1 tracking-tight text-[#F8F1E9]">
              Bienvenido de Nuevo
            </h2>
            <p className="text-xs font-semibold text-[#D4B99F] mb-6 italic">
              "El auténtico café de especialidad de Honduras en cada taza"
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left" noValidate>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <i className="fas fa-envelope text-[#007AFF]"></i> Correo Electrónico
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <i className="fas fa-lock text-[#007AFF]"></i> Contraseña
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              {loginMessage && (
                <div
                  className={`text-xs p-3 rounded-lg text-center font-semibold ${
                    loginMessage.isError
                      ? 'bg-red-500/20 text-red-200 border border-red-500/40'
                      : 'bg-green-500/20 text-green-200 border border-green-500/40'
                  }`}
                >
                  {loginMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm tracking-wide shadow-lg shadow-[#B89778]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isLoggingIn ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-xs font-medium">
              <span className="text-[#D4B99F]">¿Eres nuevo? </span>
              <button
                type="button"
                onClick={() => {
                  setLoginMessage(null);
                  setCurrentTab('register');
                }}
                className="text-[#B89778] hover:underline font-bold"
              >
                Crea una cuenta aquí
              </button>
            </div>

            <div className="mt-4 p-2 rounded-lg bg-[#B89778]/10 border border-[#B89778]/25 text-[11px] text-[#D4B99F] text-center">
              💡 Usuario demo preconfigurado listo para ingresar.
            </div>
          </div>
        )}

        {/* REGISTER CONTAINER */}
        {currentTab === 'register' && (
          <div className="w-full max-w-[460px] mx-auto bg-black/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-[#B89778]/35 text-center animate-fade-in text-[#F8F1E9]">
            <img
              src="/cafe_vistro_logo.jpg"
              alt="Café Vistro"
              className="w-14 h-14 mx-auto mb-2 rounded-full border border-[#B89778]/60 shadow-lg object-cover"
            />
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1 tracking-tight text-[#F8F1E9]">
              Únete a Café Vistro
            </h2>
            <p className="text-xs font-semibold text-[#D4B99F] mb-5">
              Crea tu cuenta de barista y recibe 50 Puntos de bienvenida
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left" noValidate>
              <div>
                <input
                  type="text"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Nombre Completo"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Correo Electrónico"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={regTelefono}
                  onChange={(e) => setRegTelefono(e.target.value)}
                  placeholder="Número de Teléfono (+504)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Crear Contraseña"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirmar Contraseña"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={regDireccion}
                  onChange={(e) => setRegDireccion(e.target.value)}
                  placeholder="Dirección de Envío en Honduras"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 dark:bg-white/10 border border-transparent focus:border-[#007AFF] outline-none text-sm transition-all"
                />
              </div>

              {registerMessage && (
                <div
                  className={`text-xs p-3 rounded-lg text-center font-semibold ${
                    registerMessage.isError
                      ? 'bg-red-500/20 text-red-200 border border-red-500/40'
                      : 'bg-green-500/20 text-green-200 border border-green-500/40'
                  }`}
                >
                  {registerMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm tracking-wide shadow-lg shadow-[#B89778]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isRegistering ? 'Procesando Registro...' : 'Crear Cuenta de Barista'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/10 text-xs font-medium">
              <span className="text-[#D4B99F]">¿Ya tienes cuenta? </span>
              <button
                type="button"
                onClick={() => {
                  setRegisterMessage(null);
                  setCurrentTab('login');
                }}
                className="text-[#B89778] hover:underline font-bold"
              >
                Inicia sesión
              </button>
            </div>
          </div>
        )}

        {/* CONTACT CONTAINER */}
        {currentTab === 'contact' && (
          <div className="w-full max-w-[480px] mx-auto bg-black/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-[#B89778]/35 text-center animate-fade-in text-[#F8F1E9]">
            <img
              src="/cafe_vistro_logo.jpg"
              alt="Café Vistro"
              className="w-16 h-16 mx-auto mb-3 rounded-full border border-[#B89778]/60 shadow-lg object-cover"
            />
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1 tracking-tight text-[#F8F1E9]">
              Conecta con Café Vistro
            </h2>
            <p className="text-xs text-[#D4B99F] mb-6">
              Tostaduría de café de especialidad y métodos artesanales en Honduras
            </p>

            <div className="space-y-4 text-left mb-6">
              <a
                href="mailto:sthephenandrew56@gmail.com"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all group border border-transparent hover:border-[#007AFF]/40"
              >
                <div className="w-10 h-10 rounded-full bg-[#007AFF]/20 flex items-center justify-center text-[#007AFF]">
                  <i className="fas fa-envelope text-lg"></i>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">Email Directo</span>
                  <span className="text-sm font-semibold text-white group-hover:text-[#007AFF] transition-colors">
                    sthephenandrew56@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="https://wa.me/50487917652?text=Hola%20Eco%20Tienda%20HN,%20deseo%20m%C3%A1s%20informaci%C3%B3n"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all group border border-transparent hover:border-[#25D366]/40"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <i className="fab fa-whatsapp text-lg"></i>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] block">WhatsApp Atención al Cliente</span>
                  <span className="text-sm font-semibold text-white group-hover:text-[#25D366] transition-colors">
                    +504 8791-7652
                  </span>
                </div>
              </a>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <a
                href="https://instagram.com/ecotiendahn"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#E1306C] text-white flex items-center justify-center text-lg transition-all hover:scale-110 shadow-md"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://facebook.com/ecotiendahn"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center text-lg transition-all hover:scale-110 shadow-md"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://tiktok.com/@ecotiendahn"
                target="_blank"
                rel="noreferrer"
                title="TikTok"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-black text-white flex items-center justify-center text-lg transition-all hover:scale-110 shadow-md"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>

            <div className="pt-6 border-t border-white/10 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Nuestras Sucursales de Retiro
              </h3>
              <div className="space-y-2">
                <a
                  href="https://maps.app.goo.gl/r6vS2GfB9E8u2e6y8"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-store text-[#007AFF]"></i> Mall Multiplaza (Tegucigalpa)
                  </span>
                  <i className="fas fa-external-link-alt text-xs text-[var(--text-muted)]"></i>
                </a>
                <a
                  href="https://maps.app.goo.gl/mP2T3G4fBqN81xQy5"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-store text-[#007AFF]"></i> Mall Galerías (San Pedro Sula)
                  </span>
                  <i className="fas fa-external-link-alt text-xs text-[var(--text-muted)]"></i>
                </a>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setCurrentTab('login')}
                className="text-xs text-[#007AFF] hover:underline font-bold"
              >
                ← Regresar al Inicio de Sesión
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

import GoogleAuthButton from "./GoogleAuthButton";

const SocialAuth = () => {
  return (
    <div className="w-full space-y-4">

      {/* Buttons */}
      <div className="grid gap-3">
        <GoogleAuthButton 
          theme="dark" 
          text="Sign in with Google" 
          onClick={() => console.log("Google Login")} 
        />
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-white/10" />
        <span className="mx-4 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold">
          Or continue with
        </span>
        <div className="flex-grow border-t border-white/10" />
      </div>
    </div>
  );
};

export default SocialAuth;
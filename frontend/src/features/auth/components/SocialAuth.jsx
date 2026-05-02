import GoogleAuthButton from "./GoogleAuthButton";

const SocialAuth = () => {
  return (
    <div className="w-full flex flex-col gap-4">

      {/* Buttons */}
      <div className="w-full">
        <GoogleAuthButton 
          theme="dark" 
          text="Sign in with Google" 
          onClick={() => console.log("Google Login")} 
        />
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-slate-700" />
        <span className="mx-4 text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Or continue with
        </span>
        <div className="flex-grow border-t border-slate-700" />
      </div>
    </div>
  );
};

export default SocialAuth;
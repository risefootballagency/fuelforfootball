import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const playerEmail = localStorage.getItem("player_email") || sessionStorage.getItem("player_email");
      if (playerEmail) {
        const { data } = await supabase
          .from("players")
          .select("id")
          .eq("email", playerEmail)
          .maybeSingle();
          
        if (data) {
          navigate("/portal");
          return;
        } else {
          localStorage.removeItem("player_email");
          sessionStorage.removeItem("player_email");
        }
      }

      const scoutEmail = localStorage.getItem("scout_email") || sessionStorage.getItem("scout_email");
      if (scoutEmail) {
        const { data } = await supabase
          .from("scouts")
          .select("id")
          .eq("email", scoutEmail)
          .maybeSingle();
          
        if (data) {
          navigate("/potential");
          return;
        } else {
          localStorage.removeItem("scout_email");
          sessionStorage.removeItem("scout_email");
        }
      }
    };

    checkAuth();

    const savedPlayerEmail = localStorage.getItem("player_saved_email");
    const savedScoutEmail = localStorage.getItem("scout_saved_email");
    const savedEmail = savedPlayerEmail || savedScoutEmail;
    
    if (savedEmail) setEmail(savedEmail);
    
    const savedPlayerRemember = localStorage.getItem("player_remember_me");
    const savedScoutRemember = localStorage.getItem("scout_remember_me");
    
    if (savedPlayerRemember === "false" || savedScoutRemember === "false") {
      setRememberMe(false);
    }
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (playerError) throw playerError;
      
      if (player) {
        try {
          localStorage.setItem("player_email", email);
          sessionStorage.setItem("player_email", email);
          localStorage.setItem("player_login_timestamp", Date.now().toString());
          
          if (rememberMe) {
            localStorage.setItem("player_saved_email", email);
            localStorage.setItem("player_remember_me", "true");
          } else {
            localStorage.removeItem("player_saved_email");
            localStorage.setItem("player_remember_me", "false");
          }
        } catch (storageError) {
          console.error("Storage error:", storageError);
        }
        
        toast.success("Welcome to your portal!");
        navigate("/portal");
        return;
      }

      const { data: scout, error: scoutError } = await supabase
        .from("scouts")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (scoutError) throw scoutError;
      
      if (scout) {
        try {
          localStorage.setItem("scout_email", email);
          sessionStorage.setItem("scout_email", email);
          localStorage.setItem("scout_login_timestamp", Date.now().toString());
          
          if (rememberMe) {
            localStorage.setItem("scout_saved_email", email);
            localStorage.setItem("scout_remember_me", "true");
          } else {
            localStorage.removeItem("scout_saved_email");
            localStorage.setItem("scout_remember_me", "false");
          }
        } catch (storageError) {
          console.error("Storage error:", storageError);
        }
        
        toast.success("Welcome to your scout portal!");
        navigate("/potential");
        return;
      }

      toast.error("Email not found. Please contact support to get access.");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to access portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <section className="relative py-16 md:py-24 px-4 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bebas uppercase tracking-wider text-foreground mb-4">
            PLAYER PORTAL
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your dedicated space for performance analysis and development.
          </p>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              className="bg-card border-border text-foreground h-12"
            />
            <Button 
              type="submit" 
              className="w-full btn-shine font-bebas text-lg uppercase tracking-wider h-12"
              disabled={loading}
            >
              {loading ? "..." : "ENTER"}
            </Button>
            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="remember" className="text-muted-foreground text-sm cursor-pointer">
                Keep me logged in
              </Label>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;

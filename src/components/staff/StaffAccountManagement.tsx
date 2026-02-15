import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SHARED_SUPABASE_URL = 'https://qwethimbtaamlhbajmal.supabase.co';
const SHARED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZXRoaW1idGFhbWxoYmFqbWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODQzNDMsImV4cCI6MjA3NjM2MDM0M30.FNM354bgxhdtM4F_KGbQQnJwX7-WngaX58kPvPYnUEY';

/** Creates a temporary client that won't persist sessions — prevents admin logout when creating new users */
const createTempClient = () =>
  createClient(SHARED_SUPABASE_URL, SHARED_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

interface StaffAccount {
  email: string;
  password: string;
  role: "admin" | "staff" | "marketeer" | "analyst";
  fullName: string;
}

export const StaffAccountManagement = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [existingAccounts, setExistingAccounts] = useState<any[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<StaffAccount | null>(null);
  const [resettingPassword, setResettingPassword] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<StaffAccount>({
    email: "",
    password: "",
    role: "staff",
    fullName: "",
  });

  useEffect(() => {
    checkAdminRole();
    fetchExistingAccounts();
  }, []);

  const fetchExistingAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role,
          user_id,
          profiles!inner (
            email,
            full_name
          )
        `);

      if (error) throw error;
      setExistingAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error("Failed to load existing accounts");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const checkAdminRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    } catch (error) {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const tempClient = createTempClient();
      let newUserId: string | undefined;

      // Try signing up the new user
      const { data: signUpData, error: signUpError } = await tempClient.auth.signUp({
        email: newAccount.email,
        password: newAccount.password,
        options: {
          data: { full_name: newAccount.fullName },
        },
      });

      if (signUpError) {
        // If user already registered, sign in to get their ID
        if (signUpError.message?.toLowerCase().includes('already registered')) {
          const { data: signInData, error: signInError } = await tempClient.auth.signInWithPassword({
            email: newAccount.email,
            password: newAccount.password,
          });

          if (signInError) {
            toast.error("User exists but couldn't verify with that password. Try a different password or use the existing account.");
            setCreating(false);
            return;
          }

          newUserId = signInData.user?.id;
          // Sign out the temp client immediately
          await tempClient.auth.signOut();
        } else {
          throw signUpError;
        }
      } else {
        newUserId = signUpData.user?.id;
      }

      if (!newUserId) throw new Error("User creation failed — no user ID returned");

      // Upsert role — handles both new and existing users
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", newUserId)
        .maybeSingle();

      if (existingRole) {
        await supabase
          .from("user_roles")
          .update({ role: newAccount.role })
          .eq("user_id", newUserId);
      } else {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: newUserId, role: newAccount.role });

        if (roleError) throw roleError;
      }

      const roleLabel = newAccount.role === "admin" ? "Admin" : newAccount.role === "marketeer" ? "Marketeer" : newAccount.role === "analyst" ? "Analyst" : "Staff";
      toast.success(`${roleLabel} account created successfully`);
      setCreatedAccount({ ...newAccount });

      fetchExistingAccounts();

      setNewAccount({
        email: "",
        password: "",
        role: "staff",
        fullName: "",
      });
    } catch (error) {
      console.error('Account creation error:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setResettingPassword(email);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      toast.success("Password reset email sent to " + email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setResettingPassword(null);
    }
  };

  const handleDeleteAccount = async (userId: string, email: string) => {
    setDeletingAccount(userId);

    try {
      // Remove role (revokes all access)
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (roleError) throw roleError;

      // Remove profile
      await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      toast.success(`Account ${email} access revoked`);
      fetchExistingAccounts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setDeletingAccount(null);
    }
  };

  const handleChangeRole = async (userId: string, _email: string, newRole: "admin" | "staff" | "marketeer" | "analyst") => {
    setUpdatingRole(userId);

    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success(`Role updated to ${newRole}`);
      fetchExistingAccounts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setUpdatingRole(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            You need admin permissions to manage staff accounts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Existing Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Staff Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAccounts ? (
            <p className="text-muted-foreground">Loading accounts...</p>
          ) : existingAccounts.length === 0 ? (
            <p className="text-muted-foreground">No staff accounts found</p>
          ) : (
            <div className="space-y-2">
              {existingAccounts.map((account) => (
                <div
                  key={account.user_id}
                  className="p-3 md:p-4 border border-primary/20 rounded-lg bg-muted/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 items-center">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm md:text-base break-all">{account.profiles?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium text-sm md:text-base">{account.profiles?.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Role</p>
                      <Select
                        value={account.role}
                        onValueChange={(value: "admin" | "staff" | "marketeer" | "analyst") =>
                          handleChangeRole(account.user_id, account.profiles?.email || '', value)
                        }
                        disabled={updatingRole === account.user_id}
                      >
                        <SelectTrigger className="w-full sm:w-[140px] h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="marketeer">Marketeer</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetPassword(account.profiles?.email || '')}
                      disabled={resettingPassword === account.profiles?.email}
                      className="w-full sm:w-auto"
                    >
                      {resettingPassword === account.profiles?.email ? "Sending..." : "Send Reset Email"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingAccount === account.user_id}
                          className="w-full sm:w-auto"
                        >
                          {deletingAccount === account.user_id ? "Revoking..." : <><Trash2 className="h-4 w-4 mr-1" /> Revoke Access</>}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke Staff Access</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to revoke access for <strong>{account.profiles?.email}</strong>? Their role and profile will be removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAccount(account.user_id, account.profiles?.email || '')}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Revoke Access
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Created Account Credentials Alert */}
      {createdAccount && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-primary">Account Created Successfully</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreatedAccount(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive mb-4 font-medium">
              ⚠️ Save these credentials now - the password will not be shown again
            </p>
            <div className="space-y-3 bg-muted p-4 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-mono font-medium">{createdAccount.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Password</p>
                <p className="font-mono font-medium">{createdAccount.password}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{createdAccount.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{createdAccount.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Account Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Staff Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email Address *</Label>
                <Input
                  id="staff-email"
                  type="email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                  placeholder="staff@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-name">Full Name</Label>
                <Input
                  id="staff-name"
                  type="text"
                  value={newAccount.fullName}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-password">Password *</Label>
                <Input
                  id="staff-password"
                  type="password"
                  value={newAccount.password}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-role">Role *</Label>
                <Select
                  value={newAccount.role}
                  onValueChange={(value: "admin" | "staff" | "marketeer" | "analyst") =>
                    setNewAccount({ ...newAccount, role: value })
                  }
                >
                  <SelectTrigger id="staff-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="staff">Staff (View Only)</SelectItem>
                    <SelectItem value="marketeer">Marketeer (Marketing & Recruitment)</SelectItem>
                    <SelectItem value="analyst">Analyst (Analysis Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Access Levels:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Admin:</strong> Can view and edit all content</li>
                <li>• <strong>Staff:</strong> Can view all content but cannot make changes</li>
                <li>• <strong>Marketeer:</strong> Can edit Network & Recruitment and Marketing & Brand sections</li>
                <li>• <strong>Analyst:</strong> Can only access the Analysis section</li>
              </ul>
            </div>

            <Button type="submit" disabled={creating} className="w-full">
              {creating ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * SignLex Frontend - Signup Page
 * Author: Pawan Rijal
 */

import AuthForm from "../../components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <AuthForm mode="signup" />
    </div>
  );
}

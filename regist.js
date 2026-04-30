const supabaseUrl = "https://orziyoasezawxugwgmob.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeml5b2FzZXphd3h1Z3dnbW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzU2MzYsImV4cCI6MjA5Mjk1MTYzNn0.1KlhhfKgBdA1B5xh9FE-4spjZTXuVJQkysjBzQpbA-8"
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let verificationPhone = "";
let registeredEmail = "";

async function createAccount() {
  const email = document.getElementById("email").value.trim();
  const confirmEmail = document.getElementById("confirmEmail").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const username = document.getElementById("username").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const statusEl = document.getElementById("statusMessage");

  // Validation
  if (!username || !email || !confirmEmail || !password || !confirmPassword) {
    statusEl.textContent = "Required fields are missing!";
    return;
  }

  if (email !== confirmEmail) {
    statusEl.textContent = "Emails don't match!";
    return;
  }

  if (password !== confirmPassword) {
    statusEl.textContent = "Passwords don't match!";
    return;
  }

  if (password.length < 6) {
    statusEl.textContent = "Password must be at least 6 characters";
    return;
  }

  if (phone && !phone.startsWith('+')) {
    statusEl.textContent = "Phone must include country code (e.g., +1)";
    return;
  }

  statusEl.textContent = "Creating account...";

  try {
    // 1. Create Supabase Auth user
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone: phone || null
        }
      }
    });

    if (error) throw error;

    registeredEmail = email;

    // 2. SAFE profile creation (USING data.user ONLY)
    const user = data?.user;

    if (user) {
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .upsert({
          id: user.id,
          username: username,
          email: email
        });

      if (profileError) {
        console.error("Profile error:", profileError);
        statusEl.textContent = profileError.message;
        return;
      }
    }

    // 3. Phone OTP (if provided)
    if (phone) {
      verificationPhone = phone;

      statusEl.textContent = "Sending verification code...";

      const { error: otpError } = await supabaseClient.auth.signInWithOtp({
        phone
      });

      if (otpError) throw otpError;

      document.getElementById("otpModal").style.display = "flex";
      document.getElementById("otpCode").focus();
    } else {
      statusEl.textContent = "Account created! Check your email.";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    }

  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
    console.error("Registration error:", error);
  }
}

async function verifyOTP() {
  const otp = document.getElementById("otpCode").value;
  const statusEl = document.getElementById("otpStatus");

  if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    statusEl.textContent = "Please enter a valid 6-digit code";
    return;
  }

  statusEl.textContent = "Verifying...";

  try {
    const { error } = await supabaseClient.auth.verifyOtp({
      phone: verificationPhone,
      token: otp,
      type: 'sms'
    });

    if (error) throw error;

    // login after OTP
    const password = document.getElementById("password").value;

    const { error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: registeredEmail,
      password
    });

    if (loginError) throw loginError;

    statusEl.textContent = "✓ Verified! Redirecting...";
    setTimeout(() => window.location.href = "home.html", 1500);

  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
  }
}

// OTP enter key support
document.getElementById("otpCode").addEventListener('keypress', (e) => {
  if (e.key === 'Enter') verifyOTP();
});

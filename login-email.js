const supabaseUrl = 'https://orziyoasezawxugwgmob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeml5b2FzZXphd3h1Z3dnbW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzU2MzYsImV4cCI6MjA5Mjk1MTYzNn0.1KlhhfKgBdA1B5xh9FE-4spjZTXuVJQkysjBzQpbA-8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

 document.getElementById('guest-link').addEventListener('click', async (e) => {
            e.preventDefault();
            
            
            const { error } = await supabaseClient.auth.signOut();
            
            
            localStorage.removeItem('cartItems');
            
            
            window.location.href = 'home.html';
        });

async function login() {
  const email = document.getElementById('email').value;
  const username = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  
  const messageEl = document.getElementById('message');
  if (!messageEl) {
    console.error("Message element not found");
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password 
    });

    if (error) throw error;
    
    if (messageEl) {
      messageEl.textContent = "Login successful! Redirecting...";
      messageEl.className = "success";
      messageEl.style.display = "block";
    }
    
    // Redirect after 1 second
    setTimeout(() => window.location.href = "/kings/home.html", 1000);
    
  } catch (error) {
    if (messageEl) {
      messageEl.textContent = error.message;
      messageEl.className = "error";
      messageEl.style.display = "block";
    }
  }
}

document.getElementById("password").addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

// Check if coming from registration
if (window.location.search.includes('from_registration=1')) {
  document.getElementById('email').value || document.getElementById('username').value = localStorage.getItem('temp_reg_email') || localStorage.getItem('temp_reg_username') || '';
  localStorage.removeItem('temp_reg_email');
}




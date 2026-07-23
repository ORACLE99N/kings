const supabaseUrl = 'https://orziyoasezawxugwgmob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeml5b2FzZXphd3h1Z3dnbW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzU2MzYsImV4cCI6MjA5Mjk1MTYzNn0.1KlhhfKgBdA1B5xh9FE-4spjZTXuVJQkysjBzQpbA-8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function loadProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        window.location.href = "index.html";
        return;
    }

    // Display email
    document.getElementById("email").textContent = user.email;

    // Display joined date
    const joinedDate = new Date(user.created_at);
    document.getElementById("joined").textContent =
        joinedDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}

window.logout = async function () {
    await supabase.auth.signOut();
    window.location.href = "home.html";
};

loadProfile();

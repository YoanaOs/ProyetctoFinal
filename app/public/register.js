const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const user = formData.get('user');
    const email = formData.get('email');
    const password = formData.get('password');

    console.log(user); 

    const res = await fetch("http://localhost:4500/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            user,
            email,
            password
        })
    });

    if (!res.ok) return mensajeError.classList.toggle("escondido",false); 
    const resJson = await res.json();
    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    }
});

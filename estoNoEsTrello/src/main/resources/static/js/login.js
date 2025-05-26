let botonIniciarSesion = document.getElementById('start_sesion_button');
    botonIniciarSesion.addEventListener('click',async()=>{
        event.preventDefault();
        let userData = {}
        userData.email = document.getElementById('input_email').value;
        userData.password = document.getElementById('input_password').value;
        userData.workSpaces = [];

        const petition = await fetch ("/user/login",
            {
                method:'POST',
                headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

        if (petition.ok){
            localStorage.setItem('email', document.getElementById('input_email').value);
            localStorage.setItem('login','true');

            //lo manda a WorkSpace Selector
            window.location.href = "../select_workspace.html";
        }
        else{
            const errorRespuesta = await petition.text();
            alert ("Un error inesperado",errorRespuesta,"error");
        }


    });
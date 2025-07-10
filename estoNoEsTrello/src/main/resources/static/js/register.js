let botonRegistrarse = document.getElementById('boton-registrar');
    botonRegistrarse.addEventListener('click',async()=>{
        event.preventDefault();
        let user = {}
        user.email = document.getElementById('input_email').value;
        if (document.getElementById('input_password').value == document.getElementById('input_password_confirm').value){
            user.password = document.getElementById('input_password').value;
            user.workSpaces = [""];

            const petition = await fetch ("/user/registro",
                {
                    method:'POST',
                    headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                });
            if (petition.ok){
                localStorage.clear();
                localStorage.setItem('email', document.getElementById('input_email').value);
                document.getElementById('input_email').value = '';
                document.getElementById('input_password').value = '';
                document.getElementById('input_password_confirm').value = '';
                localStorage.setItem('login','true');
                // botonRegistrarse.style.setProperty('color','red','important');

                //que lo envie a el WorkSpace Selector del usuario en cuestión
                window.location.href = "../index.html";
            }
            else{
                const errorRespuesta = await petition.text();
                alert ("Un error inesperado",errorRespuesta,"error");
            }
        }
        else{
            alert ("Un error inesperado","Las contraseñas no coinciden","error");
        }
    });

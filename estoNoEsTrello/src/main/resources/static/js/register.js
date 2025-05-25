let botonRegistrarse = document.getElementById('boton-registrar');
        botonRegistrarse.addEventListener('click',async()=>{
            event.preventDefault();
            let cliente = {}
            cliente.email = document.getElementById('input_email').value;
            if (document.getElementById('input_password').value == document.getElementById('input_password_confirm').value){
                cliente.
            }
            }
            else{
                swal ("Un error inesperado","Las contraseñas no coinciden","error");
            }

        }

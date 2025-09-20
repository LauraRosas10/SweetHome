/*--================== Show Hidden - Password =================*/
        const showHiddenPass = (loginPass, LoginEye) =>{
        const input = document.getElementById(loginPass),
        iconEye = document.getElementById(LoginEye)

        iconEye.addEventListener('click', () =>{
          //change password to text 
            if(input.type === 'password'){
            //switch to text 
            input.type = 'text'

            //Icon chnage
            iconEye.classList.add('ri-eye-line')
            iconEye.classList.remove('ri-eye-off-line')
            } else{

            //change to password
            input.type ='password'


            //Icon change 
            iconEye.classList.remove('ri-eye-line')
            iconEye.classList.add('ri-eye-off-line')

        }
    })
    }

    showHiddenPass('login-pass',' login-eye')
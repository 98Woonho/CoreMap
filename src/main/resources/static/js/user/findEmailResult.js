loginBtn = document.querySelector('.login-btn');

loginBtn.onclick = function() {
    const selectedValue = document.querySelector('input[name="username"]:checked').value;

    if(selectedValue) {
        location.href=`/user/login?username=${selectedValue}`;
    }
}
loginBtn = document.querySelector('.login-btn'); // 로그인 버튼

// 로그인 버튼 onclike 함수
loginBtn.onclick = function() {
    const selectedValue = document.querySelector('input[name="username"]:checked').value;

    if(selectedValue) {
        location.href=`/user/login?username=${selectedValue}`;
    }
}
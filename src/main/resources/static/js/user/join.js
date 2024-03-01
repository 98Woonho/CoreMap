const joinForm = document.getElementById('joinForm'); // 회원가입 form
const addressFindClose = document.getElementById('addressFindClose'); // 주소 찾기 창 close

// 주소 찾기 버튼 클릭 함수
joinForm['addressFind'].onclick = function () {
    // 다음 주소 API
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: function (data) {
            joinForm['addressPostal'].value = data['zonecode'];
            joinForm['addressPrimary'].value = data['address'];
            addressFindClose.classList.remove('visible');
            joinForm['addressSecondary'].focus();
            joinForm['addressSecondary'].select();
        }
    }).embed(addressFindClose.querySelector('.modal'))
    addressFindClose.classList.add('visible');
}

// 주소 찾기 창 close 클릭 함수
addressFindClose.querySelector('[rel="close"]').onclick = function () {
    addressFindClose.classList.remove('visible');
}

// 이메일 인증번호 발송 onclick 함수
joinForm['emailSend'].onclick = function (e) {
    e.preventDefault();

    if (joinForm['email'].value === '') {
        alert('이메일을 입력해 주세요.');
        return false;
    }
    if (!new RegExp(joinForm['email'].dataset.regex).test(joinForm['email'].value)) {
        alert('올바른 이메일을 입력해주세요.');
        return false;
    }
    loading.show();

    const formData = new FormData();
    formData.append('email', joinForm['email'].value);
    axios.post('/user/sendMail', formData)
        .then(res => {
            loading.hide();
            if (res.data.result === 'SUCCESS') {
                joinForm['emailSalt'].value = res.data.salt;
                joinForm['emailCode'].removeAttribute('disabled');
                joinForm['emailVerify'].removeAttribute('disabled');
                alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다. 해당 인증번호는 5분간만 유효하니 유의해 주세요.');
            } else if (res.data.result === 'FAILURE_DUPLICATE_EMAIL') {
                loading.hide();
                alert('해당 이메일은 이미 사용 중입니다. 잠시 후 다시 시도해 주세요.');
            }
        })
        .catch(err => {
            loading.hide();
            alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

// 인증번호 확인 onclick 함수
joinForm['emailVerify'].onclick = function () {
    if (joinForm['emailCode'] === '') {
        alert('인증번호를 입력해 주세요.');
        return false;
    }
    if (!new RegExp(joinForm['emailCode'].dataset.regex).test((joinForm['emailCode'].value))) {
        alert('올바른 인증번호를 입력해 주세요.');
        return false;
    }

    const formData = new FormData();
    formData.append('email', joinForm['email'].value);
    formData.append('code', joinForm['emailCode'].value);
    formData.append('salt', joinForm['emailSalt'].value);

    axios.patch('/user/sendMail', formData)
        .then(res => {
            if (res.data === 'SUCCESS') {
                alert('인증번호가 정상적으로 확인 되었습니다.');
                joinForm['emailCode'].setAttribute('disabled', '');
                joinForm['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_EXPIRED') {
                alert('인증번호를 5분 내에 입력하지 않아 만료 되었습니다. 아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.');
                joinForm['emailSalt'].value = '';
                joinForm['email'].focus();
                joinForm['email'].select();
                joinForm['emailSend'].removeAttribute('disabled');
                joinForm['emailCode'].value = '';
                joinForm['emailCode'].setAttribute('disabled', '');
                joinForm['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_INVALID_CODE') {
                alert('이메일 인증번호가 올바르지 않습니다. 입력하신 인증번호를 다시 확인해 주세요.');
                joinForm['emailCode'].focus();
                joinForm['emailCode'].select();
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 인증번호를 확인하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

// 닉네임 중복 확인 버튼 클릭 함수
joinForm['confirmDuplication'].onclick = function (e) {
    e.preventDefault();

    const nickname = joinForm['nickname'];

    if (nickname.value === '') {
        alert('닉네임을 입력해 주세요.');
        return false;
    }

    if (!new RegExp(nickname.dataset.regex).test(nickname.value)) {
        alert('10자 이내 또는 올바른 닉네임을 입력해 주세요.');
        return false;
    }

    axios.get("/user/confirmDuplication?nickname=" + nickname.value)
        .then(res => {
            if (res.data === 'FAILURE_DUPLICATED_NICKNAME') {
                alert("이미 존재하는 닉네임 입니다. 다른 닉네임을 입력해 주세요.");
            } else if (res.data === 'SUCCESS') {
                alert("사용 가능한 닉네임 입니다.");
                nickname.classList.add("confirmed");
            }
        })
        .catch(err => {
            console.log(err);
        })
}


const emailWarning = joinForm.querySelector('.email-warning'); // 이메일 경고 문구

joinForm['email'].addEventListener('blur', function () {
    if (joinForm['email'].value === '') {
        emailWarning.innerText = "이메일을 입력해 주세요.";
        emailWarning.style.color = '#ED5353';
    } else if (!new RegExp(joinForm['email'].dataset.regex).test(joinForm['email'].value)) {
        emailWarning.innerText = "올바른 이메일을 입력해 주세요.";
        emailWarning.style.color = '#ED5353';
    }

    if (new RegExp(joinForm['email'].dataset.regex).test(joinForm['email'].value)) {
        emailWarning.innerText = "";
    }
})

const passwordWarning = joinForm.querySelector('.password-warning'); // 비밀번호 경고 문구
const passwordCheckWarning = joinForm.querySelector('.password-check-warning'); // 비밀번호 재입력 경고 문구

joinForm['password'].addEventListener('input', function () {
    if (!new RegExp(joinForm['password'].dataset.regex).test(joinForm['password'].value)) {
        passwordWarning.innerText = "영문, 숫자, 특수문자를 포함한 8~15자를 입력해 주세요.";
        passwordWarning.style.color = '#ED5353';
    } else {
        passwordWarning.innerText = "사용가능한 비밀번호 입니다.";
        passwordWarning.style.color = '#3ED43D';
    }

    if (joinForm['passwordCheck'].value !== '') {
        if (joinForm['password'].value !== (joinForm['passwordCheck'].value)) {
            passwordCheckWarning.innerText = "비밀번호가 일치하지 않습니다.";
            passwordCheckWarning.style.color = '#ED5353';
        } else {
            passwordCheckWarning.innerText = "비밀번호가 일치합니다.";
            passwordCheckWarning.style.color = '#3ED43D';
        }
    }
})

joinForm['passwordCheck'].addEventListener('input', function () {
    if (joinForm['passwordCheck'].value !== '') {
        if (joinForm['password'].value !== joinForm['passwordCheck'].value) {
            passwordCheckWarning.innerText = "비밀번호가 일치하지 않습니다.";
            passwordCheckWarning.style.color = '#ED5353';
        } else {
            passwordCheckWarning.innerText = "비밀번호가 일치합니다.";
            passwordCheckWarning.style.color = '#3ED43D';
        }
    }
})

const nicknameWarning = joinForm.querySelector('.nickname-warning'); // 닉네임 경고 문구

joinForm['nickname'].addEventListener('blur', function () {
    if (joinForm['nickname'].value === '') {
        nicknameWarning.innerText = "닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    } else if (!new RegExp(joinForm['nickname'].dataset.regex).test(joinForm['nickname'].value)) {
        nicknameWarning.innerText = "10자 이내 또는 올바른 닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    }

    if (new RegExp(joinForm['nickname'].dataset.regex).test(joinForm['nickname'].value)) {
        nicknameWarning.innerText = "";
    }
})

const nameWarning = joinForm.querySelector('.name-warning'); // 이름 경고 문구

joinForm['name'].addEventListener('blur', function () {
    if (joinForm['name'].value === '') {
        nameWarning.innerText = "이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    } else if (!new RegExp(joinForm['name'].dataset.regex).test(joinForm['name'].value)) {
        nameWarning.innerText = "올바른 이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    }

    if (new RegExp(joinForm['name'].dataset.regex).test(joinForm['name'].value)) {
        nameWarning.innerText = "";
    }
})

const contactWarning = joinForm.querySelector('.contact-warning'); // 연락처 경고 문구

joinForm['contactCompany'].addEventListener('blur', function () {
    if (joinForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (joinForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(joinForm['contact'].dataset.regex).test(joinForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

joinForm['contact'].addEventListener('blur', function () {
    if (joinForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (joinForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(joinForm['contact'].dataset.regex).test(joinForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

// 회원 가입 submit 함수
joinForm.onsubmit = function (e) {
    e.preventDefault();

    if (joinForm['email'].value === "") {
        alert("이메일을 입력해 주세요.");
        joinForm['email'].focus();
        return false;
    }

    if (!new RegExp(joinForm['email'].dataset.regex).test(joinForm['email'].value)) {
        alert('올바른 이메일을 입력해 주세요.');
        joinForm['email'].focus();
        return false;
    }

    if (joinForm['emailCode'].value === "") {
        alert("인증번호를 입력해 주세요.");
        joinForm['emailCode'].focus();
        return false;
    }

    if (!new RegExp(joinForm['emailCode'].dataset.regex).test(joinForm['emailCode'].value)) {
        alert('올바른 인증번호를 입력해 주세요.');
        joinForm['emailCode'].focus();
        return false;
    }

    if (!joinForm['emailCode'].hasAttribute('disabled')) {
        console.log("hi");
        alert('인증번호 확인 버튼을 통해 인증번호를 확인해 주세요.');
        return false;
    }

    if (joinForm['password'].value === "") {
        alert('비밀번호를 입력해 주세요.');
        joinForm['password'].focus();
        return false;
    }

    if (!new RegExp(joinForm['password'].dataset.regex).test(joinForm['password'].value)) {
        alert('영문,숫자,특수문자가 1개 이상 포함된 8자리 이상 15자리 이하의 비밀번호를 입력해 주세요.');
        joinForm['password'].focus();
        return false;
    }

    if (joinForm['passwordCheck'].value === "") {
        alert('비밀번호를 다시 한 번 입력해 주세요.');
        joinForm['passwordCheck'].focus();
        return false;
    }

    if (joinForm['password'].value !== joinForm['passwordCheck'].value) {
        alert('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        joinForm['passwordCheck'].focus();
        return false;
    }

    if (joinForm['nickname'].value === "") {
        alert('닉네임을 입력해 주세요.');
        joinForm['nickname'].focus();
        return false;
    }

    if (!joinForm['nickname'].classList.contains('confirmed')) {
        alert('닉네임 중복확인을 진행해 주세요.');
        return false;
    }

    if (joinForm['name'].value === "") {
        alert('이름을 입력해 주세요.');
        joinForm['name'].focus();
        return false;
    }

    if (!new RegExp(joinForm['name'].dataset.regex).test(joinForm['name'].value)) {
        alert('올바른 이름을 입력해 주세요.');
        joinForm['name'].focus();
        return false;
    }

    if (joinForm['contactCompany'].value === '-1') {
        alert('통신사를 선택해 주세요.');
        return false;
    }

    if (joinForm['contact'].value === "") {
        alert('연락처를 입력해 주세요.');
        joinForm['contact'].focus();
        return false;
    }

    if (!new RegExp(joinForm['contact'].dataset.regex).test(joinForm['contact'].value)) {
        alert('올바른 연락처를 입력해 주세요.');
        joinForm['contact'].focus();
        return false;
    }

    if (joinForm['addressPostal'].value === '') {
        alert('우편번호를 입력해 주세요.');
        joinForm['addressPostal'].focus();
        return false;
    }

    if (!new RegExp(joinForm['addressPostal'].dataset.regex).test(joinForm['addressPostal'].value)) {
        alert('올바른 우편번호를 입력해 주세요.');
        joinForm['addressPostal'].focus();
        return false;
    }

    if (joinForm['addressPrimary'].value === '') {
        alert('주소 찾기 버튼을 통해 기본 주소를 입력해 주세요.');
        return false;
    }

    if (!new RegExp(joinForm['addressPrimary'].dataset.regex).test(joinForm['addressPrimary'].value)) {
        alert('올바른 기본 주소를 입력해 주세요.');
        joinForm['addressPrimary'].focus();
        return false;
    }

    if (joinForm['addressSecondary'].value === '') {
        alert('상세 주소를 입력해 주세요.');
        joinForm['addressSecondary'].focus();
        return false;
    }

    if (!new RegExp(joinForm['addressSecondary'].dataset.regex).test(joinForm['addressSecondary'].value)) {
        alert('올바른 상세 주소를 입력해 주세요.');
        joinForm['addressSecondary'].focus();
        return false;
    }

    const formData = new FormData();

    formData.append('username', joinForm['email'].value);
    formData.append('password', joinForm['password'].value);
    formData.append('nickname', joinForm['nickname'].value);
    formData.append('name', joinForm['name'].value);
    formData.append('contactCompanyCode', joinForm['contactCompany'].value);
    formData.append('contact', joinForm['contact'].value);
    formData.append('addressPostal', joinForm['addressPostal'].value);
    formData.append('addressPrimary', joinForm['addressPrimary'].value);
    formData.append('addressSecondary', joinForm['addressSecondary'].value);

    axios.post('/user/join', formData)
        .then(res => {
            if (res.data === 'SUCCESS') {
                alert('회원가입이 완료 되었습니다.');
                location.href = "/user/login"
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 회원가입에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}
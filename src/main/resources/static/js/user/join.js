const mainForm = document.getElementById('mainForm');
const addressFind = document.getElementById('addressFind');

mainForm['addressFind'].onclick = function () {
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: function (data) {
            mainForm['addressPostal'].value = data['zonecode'];
            mainForm['addressPrimary'].value = data['address'];
            addressFind.classList.remove('visible');
            mainForm['addressSecondary'].focus();
            mainForm['addressSecondary'].select();
        }
    }).embed(addressFind.querySelector(':scope > .modal'))
    addressFind.classList.add('visible');
}

addressFind.querySelector('[rel="close"]').onclick = function () {
    addressFind.classList.remove('visible');
}


mainForm['emailSend'].onclick = function (e) {
    e.preventDefault();

    if (mainForm['email'].value === '') {
        alert('이메일을 입력해 주세요.');
        return false;
    }
    if (!new RegExp(mainForm['email'].dataset.regex).test(mainForm['email'].value)) {
        alert('올바른 이메일을 입력해주세요.');
        return false;
    }
    loading.show();

    const formData = new FormData();
    formData.append('email', mainForm['email'].value);
    axios.post('/user/sendMail', formData)
        .then(res => {
            loading.hide();
            if (res.data.result === 'SUCCESS') {
                mainForm['emailSalt'].value = res.data.salt;
                mainForm['email'].setAttribute('disabled', ''); // name="infoEmail"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['emailSend'].setAttribute('disabled', ''); // name="infoEmailSend"인 태그에 disabled 속성 추가. ''은 속성값인데 disabled는 속성값이 없으므로 공백.
                mainForm['emailCode'].removeAttribute('disabled'); // name="infoEmailCode"인 태그에 disabled 속성 제거
                mainForm['emailVerify'].removeAttribute('disabled'); // name="infoEmailVerify"인 태그에 disabled 속성 제거
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

mainForm['emailVerify'].onclick = function () {
    if (mainForm['emailCode'] === '') {
        alert('인증번호를 입력해 주세요.');
        return false;
    }
    if (!new RegExp(mainForm['emailCode'].dataset.regex).test((mainForm['emailCode'].value))) {
        alert('올바른 인증번호를 입력해 주세요.');
        return false;
    }

    const formData = new FormData();
    formData.append('email', mainForm['email'].value);
    formData.append('code', mainForm['emailCode'].value);
    formData.append('salt', mainForm['emailSalt'].value);

    axios.patch('/user/sendMail', formData)
        .then(res => {
            if (res.data === 'SUCCESS') {
                alert('인증번호가 정상적으로 확인 되었습니다.');
                mainForm['emailCode'].setAttribute('disabled', '');
                mainForm['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_EXPIRED') {
                alert('인증번호를 5분 내에 입력하지 않아 만료 되었습니다. 아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.');
                mainForm['emailSalt'].value = '';
                mainForm['email'].removeAttribute('disabled');
                mainForm['email'].focus();
                mainForm['email'].select();
                mainForm['emailSend'].removeAttribute('disabled');
                mainForm['emailCode'].value = '';
                mainForm['emailCode'].setAttribute('disabled', '');
                mainForm['emailVerify'].setAttribute('disabled', '');
            } else if (res.data === 'FAILURE_INVALID_CODE') {
                alert('이메일 인증번호가 올바르지 않습니다. 입력하신 인증번호를 다시 확인해 주세요.');
                mainForm['emailCode'].focus();
                mainForm['emailCode'].select();
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 인증번호를 확인하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        });
}

mainForm['confirmDuplication'].onclick = function (e) {
    e.preventDefault();

    const nickname = mainForm['nickname'];

    if (nickname.value === '') {
        alert('닉네임을 입력해 주세요.');
        return false;
    }

    if (!new RegExp(nickname.dataset.regex).test(nickname.value)) {
        alert('올바른 닉네임을 입력해 주세요.');
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


const emailWarning = mainForm.querySelector('.email-warning');

mainForm['email'].addEventListener('blur', function () {
    if (mainForm['email'].value === '') {
        emailWarning.innerText = "이메일을 입력해 주세요.";
        emailWarning.style.color = '#ED5353';
    } else if (!new RegExp(mainForm['email'].dataset.regex).test(mainForm['email'].value)) {
        emailWarning.innerText = "올바른 이메일을 입력해 주세요.";
        emailWarning.style.color = '#ED5353';
    }

    if (new RegExp(mainForm['email'].dataset.regex).test(mainForm['email'].value)) {
        emailWarning.innerText = "";
    }
})

const passwordWarning = mainForm.querySelector('.password-warning');
const passwordCheckWarning = mainForm.querySelector('.password-check-warning');

mainForm['password'].addEventListener('input', function () {
    if (!new RegExp(mainForm['password'].dataset.regex).test(mainForm['password'].value)) {
        passwordWarning.innerText = "영문, 숫자, 특수문자를 포함한 8~15자를 입력해 주세요.";
        passwordWarning.style.color = '#ED5353';
    } else {
        passwordWarning.innerText = "사용가능한 비밀번호 입니다.";
        passwordWarning.style.color = '#3ED43D';
    }

    if (mainForm['passwordCheck'].value !== '') {
        if (mainForm['password'].value !== (mainForm['passwordCheck'].value)) {
            passwordCheckWarning.innerText = "비밀번호가 일치하지 않습니다.";
            passwordCheckWarning.style.color = '#ED5353';
        } else {
            passwordCheckWarning.innerText = "비밀번호가 일치합니다.";
            passwordCheckWarning.style.color = '#3ED43D';
        }
    }
})

mainForm['passwordCheck'].addEventListener('input', function () {
    if (mainForm['passwordCheck'].value !== '') {
        if (mainForm['password'].value !== mainForm['passwordCheck'].value) {
            passwordCheckWarning.innerText = "비밀번호가 일치하지 않습니다.";
            passwordCheckWarning.style.color = '#ED5353';
        } else {
            passwordCheckWarning.innerText = "비밀번호가 일치합니다.";
            passwordCheckWarning.style.color = '#3ED43D';
        }
    }
})

const nicknameWarning = mainForm.querySelector('.nickname-warning');

mainForm['nickname'].addEventListener('blur', function () {
    if (mainForm['nickname'].value === '') {
        nicknameWarning.innerText = "닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    } else if (!new RegExp(mainForm['nickname'].dataset.regex).test(mainForm['nickname'].value)) {
        nicknameWarning.innerText = "올바른 닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    }

    if (new RegExp(mainForm['nickname'].dataset.regex).test(mainForm['nickname'].value)) {
        nicknameWarning.innerText = "";
    }
})

const nameWarning = mainForm.querySelector('.name-warning');

mainForm['name'].addEventListener('blur', function () {
    if (mainForm['name'].value === '') {
        nameWarning.innerText = "이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    } else if (!new RegExp(mainForm['name'].dataset.regex).test(mainForm['name'].value)) {
        nameWarning.innerText = "올바른 이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    }

    if (new RegExp(mainForm['name'].dataset.regex).test(mainForm['name'].value)) {
        nameWarning.innerText = "";
    }
})

const contactWarning = mainForm.querySelector('.contact-warning');

mainForm['contactCompany'].addEventListener('input', function () {
    if (mainForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (mainForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(mainForm['contact'].dataset.regex).test(mainForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

mainForm['contact'].addEventListener('blur', function () {
    if (mainForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (mainForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(mainForm['contact'].dataset.regex).test(mainForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

mainForm.onsubmit = function (e) {
    e.preventDefault();

    if (mainForm['email'].value === "") {
        alert("이메일을 입력해 주세요.");
        mainForm['email'].focus();
        return false;
    }

    if (!new RegExp(mainForm['email'].dataset.regex).test(mainForm['email'].value)) {
        alert('올바른 이메일을 입력해 주세요.');
        mainForm['email'].focus();
        return false;
    }

    if (mainForm['emailCode'].value === "") {
        alert("인증번호를 입력해 주세요.");
        mainForm['emailCode'].focus();
        return false;
    }

    if (!new RegExp(mainForm['emailCode'].dataset.regex).test(mainForm['emailCode'].value)) {
        alert('올바른 인증번호를 입력해 주세요.');
        mainForm['emailCode'].focus();
        return false;
    }

    if (!mainForm['email'].hasAttribute('disabled') || !mainForm['emailCode'].hasAttribute('disabled')) {
        console.log("hi");
        alert('인증번호 확인 버튼을 통해 인증번호를 확인해 주세요.');
        return false;
    }

    if (mainForm['password'].value === "") {
        alert('비밀번호를 입력해 주세요.');
        mainForm['password'].focus();
        return false;
    }

    if (!new RegExp(mainForm['password'].dataset.regex).test(mainForm['password'].value)) {
        alert('영문,숫자,특수문자가 1개 이상 포함된 8자리 이상 15자리 이하의 비밀번호를 입력해 주세요.');
        mainForm['password'].focus();
        return false;
    }

    if (mainForm['passwordCheck'].value === "") {
        alert('비밀번호를 다시 한 번 입력해 주세요.');
        mainForm['passwordCheck'].focus();
        return false;
    }

    if (mainForm['password'].value !== mainForm['passwordCheck'].value) {
        alert('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
        mainForm['passwordCheck'].focus();
        return false;
    }

    if (mainForm['nickname'].value === "") {
        alert('닉네임을 입력해 주세요.');
        mainForm['nickname'].focus();
        return false;
    }

    if (!mainForm['nickname'].classList.contains('confirmed')) {
        alert('닉네임 중복확인을 진행해 주세요.');
        return false;
    }

    if (mainForm['name'].value === "") {
        alert('이름을 입력해 주세요.');
        mainForm['name'].focus();
        return false;
    }

    if (!new RegExp(mainForm['name'].dataset.regex).test(mainForm['name'].value)) {
        alert('올바른 이름을 입력해 주세요.');
        mainForm['name'].focus();
        return false;
    }

    if (mainForm['contactCompany'].value === '-1') {
        alert('통신사를 선택해 주세요.');
        return false;
    }

    if (mainForm['contact'].value === "") {
        alert('연락처를 입력해 주세요.');
        mainForm['contact'].focus();
        return false;
    }

    if (!new RegExp(mainForm['contact'].dataset.regex).test(mainForm['contact'].value)) {
        alert('올바른 연락처를 입력해 주세요.');
        mainForm['contact'].focus();
        return false;
    }

    if (mainForm['addressPostal'].value === '') {
        alert('우편번호를 입력해 주세요.');
        mainForm['addressPostal'].focus();
        return false;
    }

    if (!new RegExp(mainForm['addressPostal'].dataset.regex).test(mainForm['addressPostal'].value)) {
        alert('올바른 우편번호를 입력해 주세요.');
        mainForm['addressPostal'].focus();
        return false;
    }

    if (mainForm['addressPrimary'].value === '') {
        alert('주소 찾기 버튼을 통해 기본 주소를 입력해 주세요.');
        return false;
    }

    if (!new RegExp(mainForm['addressPrimary'].dataset.regex).test(mainForm['addressPrimary'].value)) {
        alert('올바른 기본 주소를 입력해 주세요.');
        mainForm['addressPrimary'].focus();
        return false;
    }

    if (mainForm['addressSecondary'].value === '') {
        alert('상세 주소를 입력해 주세요.');
        mainForm['addressSecondary'].focus();
        return false;
    }

    if (!new RegExp(mainForm['addressSecondary'].dataset.regex).test(mainForm['addressSecondary'].value)) {
        alert('올바른 상세 주소를 입력해 주세요.');
        mainForm['addressSecondary'].focus();
        return false;
    }

    const formData = new FormData();

    formData.append('username', mainForm['email'].value);
    formData.append('password', mainForm['password'].value);
    formData.append('nickname', mainForm['nickname'].value);
    formData.append('name', mainForm['name'].value);
    formData.append('contactCompanyCode', mainForm['contactCompany'].value);
    formData.append('contact', mainForm['contact'].value);
    formData.append('addressPostal', mainForm['addressPostal'].value);
    formData.append('addressPrimary', mainForm['addressPrimary'].value);
    formData.append('addressSecondary', mainForm['addressSecondary'].value);

    axios.post('/user/join', formData)
        .then(res => {
            if (res.data === 'SUCCESS') {
                alert('회원가입이 완료 되었습니다.');
                location.href = "/user/login"
            }
        })
        .catch(err => {
            alert('회원가입에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}
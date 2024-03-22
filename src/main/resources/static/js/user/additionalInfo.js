const additionalInfoForm = document.getElementById('additionalInfoForm'); // 추가 정보 입력 form
const addressFind = document.getElementById('addressFind');

// 주소 찾기 버튼 클릭 함수
additionalInfoForm['addressFindBtn'].addEventListener('click', function (e) {
    e.preventDefault();

    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: function (data) {
            additionalInfoForm['addressPostal'].value = data['zonecode'];
            additionalInfoForm['addressPrimary'].value = data['address'];
            addressFind.classList.remove('visible');
            additionalInfoForm['addressSecondary'].focus();
            additionalInfoForm['addressSecondary'].select();
        }
    }).embed(addressFind.querySelector(':scope > .modal'))
    addressFind.classList.add('visible');
})

// 주소 찾기 창 close 클릭 함수
addressFind.querySelector('[rel="close"]').onclick = function () {
    addressFind.classList.remove('visible');
}

// 닉네임 중복 확인 버튼 클릭 함수
additionalInfoForm['confirmDuplicationBtn'].onclick = function (e) {
    e.preventDefault();

    if (additionalInfoForm['nickname'].value === '') {
        alert('닉네임을 입력해 주세요.');
        return false;
    }

    if (!new RegExp(additionalInfoForm['nickname'].dataset.regex).test(additionalInfoForm['nickname'].value)) {
        alert('10자 이내 또는 올바른 닉네임을 입력해 주세요.');
        return false;
    }

    axios.get("/user/confirmDuplication?nickname=" + additionalInfoForm['nickname'].value)
        .then(res => {
            if (res.data === 'FAILURE_DUPLICATED_NICKNAME') {
                alert("이미 존재하는 닉네임 입니다. 다른 닉네임을 입력해 주세요.");
            } else if (res.data === 'SUCCESS') {
                alert("사용 가능한 닉네임 입니다.");
                additionalInfoForm['nickname'].classList.add("confirmed");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

const nicknameWarning = document.getElementById('nicknameWarning'); // 닉네임 경고 문구
additionalInfoForm['nickname'].addEventListener('blur', function () {
    if (additionalInfoForm['nickname'].value === '') {
        nicknameWarning.innerText = "닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    } else if (!new RegExp(additionalInfoForm['nickname'].dataset.regex).test(additionalInfoForm['nickname'].value)) {
        nicknameWarning.innerText = "10자 이내 또는 올바른 닉네임을 입력해 주세요.";
        nicknameWarning.style.color = '#ED5353';
    }

    if (new RegExp(additionalInfoForm['nickname'].dataset.regex).test(additionalInfoForm['nickname'].value)) {
        nicknameWarning.innerText = "";
    }
})

const nameWarning = document.getElementById('nameWarning'); // 이름 경고 문구
additionalInfoForm['name'].addEventListener('blur', function () {
    if (additionalInfoForm['name'].value === '') {
        nameWarning.innerText = "이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    } else if (!new RegExp(additionalInfoForm['name'].dataset.regex).test(additionalInfoForm['name'].value)) {
        nameWarning.innerText = "올바른 이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    }

    if (new RegExp(additionalInfoForm['name'].dataset.regex).test(additionalInfoForm['name'].value)) {
        nameWarning.innerText = "";
    }
})

const contactWarning = document.getElementById('contactWarning'); // 연락처 경고 문구
additionalInfoForm['contactCompany'].addEventListener('blur', function () {
    if (additionalInfoForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (additionalInfoForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(additionalInfoForm['contact'].dataset.regex).test(additionalInfoForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

additionalInfoForm['contact'].addEventListener('blur', function () {
    if (additionalInfoForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (additionalInfoForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(additionalInfoForm['contact'].dataset.regex).test(additionalInfoForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

// 추가 정보 입력 submit 함수
additionalInfoForm.onsubmit = function (e) {
    e.preventDefault();

    if (additionalInfoForm['nickname'].value === "") {
        alert('닉네임을 입력해 주세요.');
        additionalInfoForm['nickname'].focus();
        return false;
    }

    if (!additionalInfoForm['nickname'].classList.contains('confirmed')) {
        alert('닉네임 중복확인을 진행해 주세요.');
        return false;
    }

    if (additionalInfoForm['name'].value === "") {
        alert('이름을 입력해 주세요.');
        additionalInfoForm['name'].focus();
        return false;
    }

    if (!new RegExp(additionalInfoForm['name'].dataset.regex).test(additionalInfoForm['name'].value)) {
        alert('올바른 이름을 입력해 주세요.');
        additionalInfoForm['name'].focus();
        return false;
    }

    if (additionalInfoForm['contactCompany'].value === '-1') {
        alert('통신사를 선택해 주세요.');
        return false;
    }

    if (additionalInfoForm['contact'].value === "") {
        alert('연락처를 입력해 주세요.');
        additionalInfoForm['contact'].focus();
        return false;
    }

    if (!new RegExp(additionalInfoForm['contact'].dataset.regex).test(additionalInfoForm['contact'].value)) {
        alert('올바른 연락처를 입력해 주세요.');
        additionalInfoForm['contact'].focus();
        return false;
    }

    if (additionalInfoForm['addressPostal'].value === '') {
        alert('우편번호를 입력해 주세요.');
        additionalInfoForm['addressPostal'].focus();
        return false;
    }

    if (!new RegExp(additionalInfoForm['addressPostal'].dataset.regex).test(additionalInfoForm['addressPostal'].value)) {
        alert('올바른 우편번호를 입력해 주세요.');
        additionalInfoForm['addressPostal'].focus();
        return false;
    }

    if (additionalInfoForm['addressPrimary'].value === '') {
        alert('주소 찾기 버튼을 통해 기본 주소를 입력해 주세요.');
        return false;
    }

    if (!new RegExp(additionalInfoForm['addressPrimary'].dataset.regex).test(additionalInfoForm['addressPrimary'].value)) {
        alert('올바른 기본 주소를 입력해 주세요.');
        additionalInfoForm['addressPrimary'].focus();
        return false;
    }

    if (additionalInfoForm['addressSecondary'].value === '') {
        alert('상세 주소를 입력해 주세요.');
        additionalInfoForm['addressSecondary'].focus();
        return false;
    }

    if (!new RegExp(additionalInfoForm['addressSecondary'].dataset.regex).test(additionalInfoForm['addressSecondary'].value)) {
        alert('올바른 상세 주소를 입력해 주세요.');
        additionalInfoForm['addressSecondary'].focus();
        return false;
    }

    const formData = new FormData();

    formData.append('nickname', additionalInfoForm['nickname'].value);
    formData.append('name', additionalInfoForm['name'].value);
    formData.append('contactCompanyCode', additionalInfoForm['contactCompany'].value);
    formData.append('contact', additionalInfoForm['contact'].value);
    formData.append('addressPostal', additionalInfoForm['addressPostal'].value);
    formData.append('addressPrimary', additionalInfoForm['addressPrimary'].value);
    formData.append('addressSecondary', additionalInfoForm['addressSecondary'].value);

    axios.patch('/user/additionalInfo', formData)
        .then(res => {
            alert('추가 정보 등록이 완료 되었습니다.');
            location.href = '/';
        })
        .catch(err => {
            alert('알 수 없는 이유로 추가정보 등록에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
}
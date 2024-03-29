const modifyForm = document.getElementById('modifyForm'); // 마이페이지 - 개인정보확인/수정 form
const addressFind = document.getElementById('addressFind'); // 주소 찾기 창 close

if (modifyForm) {
    // 주소 찾기 버튼 클릭 함수
    modifyForm['addressFind'].addEventListener('click', function () {
        // 다음 주소 API
        new daum.Postcode({
            width: '100%',
            height: '100%',
            oncomplete: function (data) {
                modifyForm['addressPostal'].value = data['zonecode'];
                modifyForm['addressPrimary'].value = data['address'];
                addressFind.classList.remove('visible');
                modifyForm['addressSecondary'].focus();
                modifyForm['addressSecondary'].select();
            }
        }).embed(addressFind.querySelector('.modal'))
        addressFind.classList.add('visible');
    })

    // 주소 찾기 창 close 클릭 함수
    addressFind.querySelector('[rel="close"]').addEventListener('click', function () {
        addressFind.classList.remove('visible');
    })

    const modifyBtn = document.getElementById('modifyBtn'); // 수정 버튼
    const inputs = modifyForm.querySelectorAll('input');

    modifyForm['contactCompany'].addEventListener('change', function () {
        modifyBtn.removeAttribute('disabled');
    })

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            modifyBtn.removeAttribute('disabled');
        })
    })

    // 닉네임 중복 확인 버튼 클릭 함수
    modifyForm['confirmDuplicationBtn'].addEventListener('click', function (e) {
        e.preventDefault();

        if (modifyForm['nickname'].value === '') {
            alert('닉네임을 입력해 주세요.');
            return false;
        }

        if (!new RegExp(modifyForm['nickname'].dataset.regex).test(modifyForm['nickname'].value)) {
            alert('10자 이내 또는 올바른 닉네임을 입력해 주세요.');
            return false;
        }

        axios.get(`/user/confirmDuplication?nickname=${modifyForm['nickname'].value}`)
            .then(res => {
                if (res.data === 'FAILURE_DUPLICATED_NICKNAME') {
                    alert("이미 존재하는 닉네임 입니다. 다른 닉네임을 입력해 주세요.");
                } else if (res.data === 'SUCCESS') {
                    alert("사용 가능한 닉네임 입니다.");
                    modifyForm['nickname'].classList.add("confirmed");
                }
            })
            .catch(err => {
                console.log(err);
            })
    })

    // 닉네임 입력란 input event
    modifyForm['nickname'].addEventListener('input', function () {
        if (modifyForm['nickname'].value === modifyForm['currentNickname'].value) {
            modifyForm['confirmDuplication'].setAttribute('disabled', '');
        } else {
            modifyForm['confirmDuplication'].removeAttribute('disabled');
        }
    })


    const nicknameWarning = document.getElementById('nicknameWarning'); // 닉네임 경고 문구

    // 닉네임 입력란 blur event
    modifyForm['nickname'].addEventListener('blur', function () {
        if (modifyForm['nickname'].value === '') {
            nicknameWarning.innerText = "닉네임을 입력해 주세요.";
            nicknameWarning.style.color = '#ED5353';
        } else if (!new RegExp(modifyForm['nickname'].dataset.regex).test(modifyForm['nickname'].value)) {
            nicknameWarning.innerText = "10자 이내 또는 올바른 닉네임을 입력해 주세요.";
            nicknameWarning.style.color = '#ED5353';
        }

        if (new RegExp(modifyForm['nickname'].dataset.regex).test(modifyForm['nickname'].value)) {
            nicknameWarning.innerText = "";
        }
    })


    const nameWarning = document.getElementById('nameWarning'); // 이름 경고 문구

    // 이름 입력란 blur event
    modifyForm['name'].addEventListener('blur', function () {
        if (modifyForm['name'].value === '') {
            nameWarning.innerText = "이름을 입력해 주세요.";
            nameWarning.style.color = '#ED5353';
        } else if (!new RegExp(modifyForm['name'].dataset.regex).test(modifyForm['name'].value)) {
            nameWarning.innerText = "올바른 이름을 입력해 주세요.";
            nameWarning.style.color = '#ED5353';
        }

        if (new RegExp(modifyForm['name'].dataset.regex).test(modifyForm['name'].value)) {
            nameWarning.innerText = "";
        }
    })

    const contactWarning = document.getElementById('contactWarning'); // 연락처 경고 문구

    // 통신사 선택란 blur event
    modifyForm['contactCompany'].addEventListener('blur', function () {
        if (modifyForm['contactCompany'].value === '-1') {
            contactWarning.innerText = "통신사를 선택해 주세요.";
            contactWarning.style.color = '#ED5353';
        } else if (modifyForm['contact'].value === '') {
            contactWarning.innerText = "연락처를 입력해 주세요.";
            contactWarning.style.color = '#ED5353';
        } else if (!new RegExp(modifyForm['contact'].dataset.regex).test(modifyForm['contact'].value)) {
            contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
            contactWarning.style.color = '#ED5353';
        } else {
            contactWarning.innerText = "";
        }
    })

    // 연락처 입력란 blur event
    modifyForm['contact'].addEventListener('blur', function () {
        if (modifyForm['contactCompany'].value === '-1') {
            contactWarning.innerText = "통신사를 선택해 주세요.";
            contactWarning.style.color = '#ED5353';
        } else if (modifyForm['contact'].value === '') {
            contactWarning.innerText = "연락처를 입력해 주세요.";
            contactWarning.style.color = '#ED5353';
        } else if (!new RegExp(modifyForm['contact'].dataset.regex).test(modifyForm['contact'].value)) {
            contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
            contactWarning.style.color = '#ED5353';
        } else {
            contactWarning.innerText = "";
        }
    })

    // 개인 정보 수정 submit 함수
    modifyForm.onsubmit = function (e) {
        e.preventDefault();

        if (modifyForm['nickname'].value === "") {
            alert('닉네임을 입력해 주세요.');
            modifyForm['nickname'].focus();
            return false;
        }

        if (!modifyForm['nickname'].value === modifyForm['currentNickname'].value && !modifyForm['nickname'].classList.contains('confirmed')) {
            alert('닉네임 중복확인을 진행해 주세요.');
            return false;
        }

        if (modifyForm['name'].value === "") {
            alert('이름을 입력해 주세요.');
            modifyForm['name'].focus();
            return false;
        }

        if (!new RegExp(modifyForm['name'].dataset.regex).test(modifyForm['name'].value)) {
            alert('올바른 이름을 입력해 주세요.');
            modifyForm['name'].focus();
            return false;
        }

        if (modifyForm['contactCompany'].value === '-1') {
            alert('통신사를 선택해 주세요.');
            return false;
        }

        if (modifyForm['contact'].value === "") {
            alert('연락처를 입력해 주세요.');
            modifyForm['contact'].focus();
            return false;
        }

        if (!new RegExp(modifyForm['contact'].dataset.regex).test(modifyForm['contact'].value)) {
            alert('올바른 연락처를 입력해 주세요.');
            modifyForm['contact'].focus();
            return false;
        }

        if (modifyForm['addressPostal'].value === '') {
            alert('우편번호를 입력해 주세요.');
            modifyForm['addressPostal'].focus();
            return false;
        }

        if (!new RegExp(modifyForm['addressPostal'].dataset.regex).test(modifyForm['addressPostal'].value)) {
            alert('올바른 우편번호를 입력해 주세요.');
            modifyForm['addressPostal'].focus();
            return false;
        }

        if (modifyForm['addressPrimary'].value === '') {
            alert('주소 찾기 버튼을 통해 기본 주소를 입력해 주세요.');
            return false;
        }

        if (!new RegExp(modifyForm['addressPrimary'].dataset.regex).test(modifyForm['addressPrimary'].value)) {
            alert('올바른 기본 주소를 입력해 주세요.');
            modifyForm['addressPrimary'].focus();
            return false;
        }

        if (modifyForm['addressSecondary'].value === '') {
            alert('상세 주소를 입력해 주세요.');
            modifyForm['addressSecondary'].focus();
            return false;
        }

        if (!new RegExp(modifyForm['addressSecondary'].dataset.regex).test(modifyForm['addressSecondary'].value)) {
            alert('올바른 상세 주소를 입력해 주세요.');
            modifyForm['addressSecondary'].focus();
            return false;
        }

        const formData = new FormData();
        formData.append('nickname', modifyForm['nickname'].value);
        formData.append('name', modifyForm['name'].value);
        formData.append('contactCompanyCode', modifyForm['contactCompany'].value);
        formData.append('contact', modifyForm['contact'].value);
        formData.append('addressPostal', modifyForm['addressPostal'].value);
        formData.append('addressPrimary', modifyForm['addressPrimary'].value);
        formData.append('addressSecondary', modifyForm['addressSecondary'].value);

        axios.patch('/user/modify', formData)
            .then(res => {
                if (res.data === 'SUCCESS') {
                    alert('개인정보 수정이 완료 되었습니다.');
                    location.reload();
                }
            })
            .catch(err => {
                alert('알 수 없는 이유로 개인정보 수정에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
            })
    }
}

const secessionForm = document.getElementById('secessionForm'); // 회원 탈퇴 form

if (secessionForm) {
    // 회원 탈퇴 submit 함수
    secessionForm.onsubmit = function (e) {
        e.preventDefault();

        dialog.show({
            title: '회원탈퇴',
            content: '정말로 회원탈퇴를 하시겠습니까?',
            buttons: [
                dialog.createButton('취소', dialog.hide),
                dialog.createButton('확인', function () {
                    dialog.hide();
                    secessionFunc();
                })
            ]
        })
    }

    function secessionFunc() {
        axios.delete('/user/myPage')
            .then(res => {
                location.href = '/user/secessionCompletion';
            })
            .catch(err => {
                alert('알 수 없는 이유로 회원 탈퇴에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
            })
    }
}
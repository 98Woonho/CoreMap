const findEmailForm = document.getElementById('findEmailForm'); // 이메일 찾기 form

const nameWarning = document.getElementById('nameWarning'); // 이름 경고 문구

// 이름 입력란 blur event
findEmailForm['name'].addEventListener('blur', function () {
    if (findEmailForm['name'].value === '') {
        nameWarning.innerText = "이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    } else if (!new RegExp(findEmailForm['name'].dataset.regex).test(findEmailForm['name'].value)) {
        nameWarning.innerText = "올바른 이름을 입력해 주세요.";
        nameWarning.style.color = '#ED5353';
    }

    if (new RegExp(findEmailForm['name'].dataset.regex).test(findEmailForm['name'].value)) {
        nameWarning.innerText = "";
    }
})

// 통신사 입력란 blur event
findEmailForm['contactCompany'].addEventListener('blur', function () {
    if (findEmailForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (findEmailForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(findEmailForm['contact'].dataset.regex).test(findEmailForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

// 연락처 입력란 blur event
findEmailForm['contact'].addEventListener('blur', function () {
    if (findEmailForm['contactCompany'].value === '-1') {
        contactWarning.innerText = "통신사를 선택해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (findEmailForm['contact'].value === '') {
        contactWarning.innerText = "연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else if (!new RegExp(findEmailForm['contact'].dataset.regex).test(findEmailForm['contact'].value)) {
        contactWarning.innerText = "올바른 연락처를 입력해 주세요.";
        contactWarning.style.color = '#ED5353';
    } else {
        contactWarning.innerText = "";
    }
})

// 이메일 찾기 submit 함수
findEmailForm.onsubmit = function(e) {
    e.preventDefault();

    if (findEmailForm['name'].value === "") {
        alert('이름을 입력해 주세요.');
        findEmailForm['name'].focus();
        return false;
    }

    if (!new RegExp(findEmailForm['name'].dataset.regex).test(findEmailForm['name'].value)) {
        alert('올바른 이름을 입력해 주세요.');
        findEmailForm['name'].focus();
        return false;
    }

    if (findEmailForm['contact'].value === "") {
        alert('연락처를 입력해 주세요.');
        findEmailForm['contact'].focus();
        return false;
    }

    if (!new RegExp(findEmailForm['contact'].dataset.regex).test(findEmailForm['contact'].value)) {
        alert('올바른 연락처를 입력해 주세요.');
        findEmailForm['contact'].focus();
        return false;
    }

    location.href = `/user/findEmailResult?name=${findEmailForm['name'].value}&contact=${findEmailForm['contact'].value}`;
}
document.addEventListener('DOMContentLoaded', function() {
    const phoneForm = document.getElementById('phoneForm');
    const otpForm = document.getElementById('otpForm');
    const phoneError = document.getElementById('phoneError');
    const otpError = document.getElementById('otpError');
    const resendOtpButton = document.getElementById('resendOtp');
    const phoneNumberDisplay = document.getElementById('phoneNumber');

    const otpPopup = document.getElementById('otpPopup');
    const otpCode = document.getElementById('otpCode');
    const closeBtn = document.getElementsByClassName('close')[0];

    if (phoneForm) {
        phoneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const countryCode = document.getElementById('countryCode').value;
            const phone = document.getElementById('phone').value;
            if (validatePhone(phone)) {
                generateAndShowOTP(countryCode, phone);
                localStorage.setItem('countryCode', countryCode); // Store country code
                localStorage.setItem('phone', phone); // Store phone number
                window.location.href = 'otp.html'; // Redirect to OTP page
            } else {
                phoneError.textContent = 'Please enter a valid phone number.';
            }
        });
    }

    if (otpForm) {
        const otpInputs = document.querySelectorAll('.otp-input input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
        });

        otpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const otp = Array.from(otpInputs).map(input => input.value).join('');
            const storedOtp = localStorage.getItem('otp');
            if (otp === storedOtp) {
                window.location.href = 'welcome.html';
            } else {
                otpError.textContent = 'Invalid OTP. Please try again.';
            }
        });

        resendOtpButton.addEventListener('click', function() {
            const countryCode = localStorage.getItem('countryCode');
            const phone = localStorage.getItem('phone');
            if (phone) {
                generateAndShowOTP(countryCode, phone);
            }
        });
    }

    if (otpPopup) {
        // Check if OTP popup should be displayed
        if (localStorage.getItem('otp')) {
            otpCode.textContent = localStorage.getItem('otp');
            otpPopup.style.display = 'block';
        }

        closeBtn.onclick = function() {
            otpPopup.classList.add('fade-out');
            setTimeout(() => {
                otpPopup.style.display = 'none';
            }, 300); // Duration should match the fade-out duration in CSS
        };

        window.onclick = function(event) {
            if (event.target === otpPopup) {
                otpPopup.classList.add('fade-out');
                setTimeout(() => {
                    otpPopup.style.display = 'none';
                }, 300); // Duration should match the fade-out duration in CSS
            }
        };
    }

    if (phoneNumberDisplay) {
        const countryCode = localStorage.getItem('countryCode');
        const phone = localStorage.getItem('phone');
        if (countryCode && phone) {
            phoneNumberDisplay.innerHTML = `Phone Number: <span>${countryCode} ${phone}</span>`;
        }
    }

    function validatePhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    function generateAndShowOTP(countryCode, phone) {
        const otp = generateOTP();
        localStorage.setItem('otp', otp); // Store OTP in local storage

        // Check if phoneNumberDisplay is available
        if (phoneNumberDisplay) {
            phoneNumberDisplay.innerHTML = `Phone Number: <span>${countryCode} ${phone}</span>`;
        }

        // Display the OTP in the popup
        if (otpPopup) {
            otpCode.textContent = otp;
            otpPopup.style.display = 'block';
        }
    }

    function generateOTP() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
});

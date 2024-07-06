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

    const verifyOTP = async (userId, otp) => {
        try {
            console.log('Verifying OTP...');
            let response = await fetch("https://saveright.in/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({ userId, otp }),
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                console.log(response.status,response.statusText)
                throw new Error(`Server error: in veryfying tokens`);
            }

            const data = await response.json();
            console.log('Server response:', data); 

            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            console.log("OTP is successfully verified");

            window.location.href = 'welcome.html'; 
        } catch (error) {
            console.error("Error in verifying OTP:", error);
            otpError.textContent = 'Invalid OTP. Please try again.';
        }
    };
    

    const sendOTP = async (countrycode, phoneNumber) => {
        try {
            let response = await fetch("https://saveright.in/auth/signup", {
                method: "POST",
                body: JSON.stringify({ isdCode: countrycode, phone: phoneNumber }),
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            const data = await response.json();
            localStorage.setItem("userId", data.userId);
            console.log("OTP is successfully sent");
        } catch (error) {
            console.log("Error in sending OTP");
        }
    };

// sendOTP(91,7990336834)

if (phoneForm) {
    phoneForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const countryCode = document.getElementById('countryCode').value;
        const phone = document.getElementById('phone').value;
        console.log(countryCode, phone);

        if (validatePhone(phone)) {
            // Store country code and phone number
            localStorage.setItem('countryCode', countryCode);
            localStorage.setItem('phone', phone);
            
            // Send OTP and redirect upon success
            try {
                await sendOTP(countryCode, phone);
                window.location.href = 'pages/otp.html'; // Redirect to OTP page
            } catch (error) {
                console.error('Error sending OTP:', error);
                phoneError.textContent = 'Error sending OTP. Please try again.';
            }
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
 const userId = localStorage.getItem('userId');
            if (userId) {
                verifyOTP(userId, otp);
            } else {
                otpError.textContent = 'User ID not found. Please try again.';
            }

            // const storedOtp = localStorage.getItem('otp');
            // if (otp === storedOtp) {
            //     window.location.href = 'welcome.html';
            // } else {
            //     otpError.textContent = 'Invalid OTP. Please try again.';
            // }
        });

        resendOtpButton.addEventListener('click', function() {
            const countryCode = localStorage.getItem('countryCode');
            const phone = localStorage.getItem('phone');
            otpInputs.forEach(input => input.value = ''); // Clear OTP fields
            if (phone) {
                sendOTP(countryCode, phone);
            }
        });
    }

    // if (otpPopup) {
    //     // Check if OTP popup should be displayed
    //     if (localStorage.getItem('otp')) {
    //         otpCode.textContent = localStorage.getItem('otp');
    //         otpPopup.style.display = 'block';
    //     }

    //     closeBtn.onclick = function() {
    //         otpPopup.classList.add('fade-out');
    //         setTimeout(() => {
    //             otpPopup.style.display = 'none';
    //         }, 300); // Duration should match the fade-out duration in CSS
    //     };

    //     window.onclick = function(event) {
    //         if (event.target === otpPopup) {
    //             otpPopup.classList.add('fade-out');
    //             setTimeout(() => {
    //                 otpPopup.style.display = 'none';
    //             }, 300); // Duration should match the fade-out duration in CSS
    //         }
    //     };
    // }

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

    // function generateOTP() {
    //     return Math.floor(1000 + Math.random() * 9000).toString();
    // }
});

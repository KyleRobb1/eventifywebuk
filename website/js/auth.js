document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Login form validation and submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            clearErrors();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Validate email
            if (!email) {
                showError('email', 'Email is required');
                return;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                return;
            }
            
            // Validate password
            if (!password) {
                showError('password', 'Password is required');
                return;
            }
            
            // Simulate login API call
            simulateLoginApi(email, password);
        });
    }
    
    // Registration form validation and submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Add password strength meter if on registration page
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            // Create password strength elements
            const strengthContainer = document.createElement('div');
            strengthContainer.className = 'password-strength';
            
            const strengthMeter = document.createElement('div');
            strengthMeter.className = 'strength-meter';
            
            const strengthFill = document.createElement('div');
            strengthFill.className = 'strength-meter-fill';
            
            const strengthText = document.createElement('div');
            strengthText.className = 'strength-text';
            
            // Append elements
            strengthMeter.appendChild(strengthFill);
            strengthContainer.appendChild(strengthMeter);
            strengthContainer.appendChild(strengthText);
            
            // Insert after password error message
            const passwordError = document.getElementById('password-error');
            passwordError.parentNode.insertBefore(strengthContainer, passwordError.nextSibling);
            
            // Add input event listener for password strength
            passwordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors
            clearErrors();
            
            // Get form values
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsChecked = document.getElementById('terms').checked;
            
            // Validate first name
            if (!firstName) {
                showError('first-name', 'First name is required');
                return;
            }
            
            // Validate last name
            if (!lastName) {
                showError('last-name', 'Last name is required');
                return;
            }
            
            // Validate email
            if (!email) {
                showError('email', 'Email is required');
                return;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                return;
            }
            
            // Validate password
            if (!password) {
                showError('password', 'Password is required');
                return;
            } else if (password.length < 8) {
                showError('password', 'Password must be at least 8 characters');
                return;
            }
            
            // Validate password strength
            const strength = checkPasswordStrength(password);
            if (strength === 'weak') {
                showError('password', 'Password is too weak');
                return;
            }
            
            // Validate confirm password
            if (!confirmPassword) {
                showError('confirm-password', 'Please confirm your password');
                return;
            } else if (password !== confirmPassword) {
                showError('confirm-password', 'Passwords do not match');
                return;
            }
            
            // Validate terms
            if (!termsChecked) {
                showError('terms', 'You must agree to the Terms of Service');
                return;
            }
            
            // Simulate registration API call
            simulateRegisterApi(firstName, lastName, email, password);
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
            this.disabled = true;
            
            // Simulate social login
            setTimeout(() => {
                alert(`${provider} login would be implemented with actual OAuth in a real application.`);
                
                // Reset button
                this.innerHTML = this.classList.contains('google-btn') ? 
                    '<i class="fab fa-google"></i><span>Continue with Google</span>' : 
                    '<i class="fab fa-facebook-f"></i><span>Continue with Facebook</span>';
                this.disabled = false;
            }, 2000);
        });
    });
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create modal for password reset
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Reset Password</h2>
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                    <form id="reset-password-form">
                        <div class="form-group">
                            <label for="reset-email">Email</label>
                            <div class="input-with-icon">
                                <i class="fas fa-envelope"></i>
                                <input type="email" id="reset-email" required>
                            </div>
                            <div class="error-message" id="reset-email-error"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Send Reset Link</button>
                    </form>
                </div>
            `;
            
            // Add styles for modal
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                }
                
                .modal-content {
                    background-color: white;
                    border-radius: 8px;
                    max-width: 400px;
                    margin: 100px auto;
                    padding: 30px;
                    position: relative;
                }
                
                .close-modal {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
            
            // Append modal to body
            document.body.appendChild(modal);
            
            // Close modal functionality
            const closeModal = modal.querySelector('.close-modal');
            closeModal.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Reset password form submission
            const resetForm = document.getElementById('reset-password-form');
            resetForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('reset-email').value.trim();
                
                // Validate email
                if (!email) {
                    const errorElement = document.getElementById('reset-email-error');
                    errorElement.textContent = 'Email is required';
                    document.getElementById('reset-email').classList.add('error');
                    return;
                } else if (!isValidEmail(email)) {
                    const errorElement = document.getElementById('reset-email-error');
                    errorElement.textContent = 'Please enter a valid email address';
                    document.getElementById('reset-email').classList.add('error');
                    return;
                }
                
                // Show success message
                modal.querySelector('.modal-content').innerHTML = `
                    <h2>Email Sent</h2>
                    <p>If an account exists for ${email}, we've sent a password reset link to this email address.</p>
                    <button class="btn btn-primary btn-block" id="close-reset-modal">Close</button>
                `;
                
                // Close button functionality
                document.getElementById('close-reset-modal').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
            });
        });
    }
    
    // Helper Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            document.getElementById(fieldId).classList.add('error');
        }
    }
    
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('input');
        
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        inputElements.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    function checkPasswordStrength(password) {
        // Simple password strength check
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        
        if (isLongEnough && hasLetter && hasNumber && hasSpecial) {
            return 'very-strong';
        } else if (isLongEnough && hasLetter && hasNumber) {
            return 'strong';
        } else if (isLongEnough && (hasLetter || hasNumber)) {
            return 'medium';
        } else {
            return 'weak';
        }
    }
    
    function updatePasswordStrength(password) {
        const strengthContainer = document.querySelector('.password-strength');
        if (!strengthContainer) return;
        
        const strengthText = strengthContainer.querySelector('.strength-text');
        
        // Remove previous classes
        strengthContainer.classList.remove('weak', 'medium', 'strong', 'very-strong');
        
        if (!password) {
            strengthText.textContent = '';
            return;
        }
        
        // Check strength
        const strength = checkPasswordStrength(password);
        
        // Update UI
        strengthContainer.classList.add(strength);
        
        switch (strength) {
            case 'weak':
                strengthText.textContent = 'Weak password';
                strengthText.style.color = '#ff6b6b';
                break;
            case 'medium':
                strengthText.textContent = 'Medium password';
                strengthText.style.color = '#ffbb33';
                break;
            case 'strong':
                strengthText.textContent = 'Strong password';
                strengthText.style.color = '#00c851';
                break;
            case 'very-strong':
                strengthText.textContent = 'Very strong password';
                strengthText.style.color = '#007e33';
                break;
        }
    }
    
    // API Simulation Functions
    function simulateLoginApi(email, password) {
        // Get login button and show loading state
        const loginButton = document.querySelector('#login-form button[type="submit"]');
        const originalText = loginButton.textContent;
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        
        // Simulate API delay
        setTimeout(() => {
            // For demo purposes, accept any credentials
            // In a real app, this would validate against a backend
            
            // Create user object and store in localStorage
            const user = {
                email: email,
                name: email.split('@')[0], // Simple name extraction from email
                isLoggedIn: true,
                token: 'demo-token-' + Math.random().toString(36).substring(2)
            };
            
            localStorage.setItem('eventifyUser', JSON.stringify(user));
            
            // Redirect to dashboard or home page
            window.location.href = 'dashboard.html';
        }, 2000);
    }
    
    function simulateRegisterApi(firstName, lastName, email, password) {
        // Get register button and show loading state
        const registerButton = document.querySelector('#register-form button[type="submit"]');
        const originalText = registerButton.textContent;
        registerButton.disabled = true;
        registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        // Simulate API delay
        setTimeout(() => {
            // For demo purposes, always succeed
            // In a real app, this would register with a backend
            
            // Create user object and store in localStorage
            const user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                name: firstName + ' ' + lastName,
                isLoggedIn: true,
                token: 'demo-token-' + Math.random().toString(36).substring(2)
            };
            
            localStorage.setItem('eventifyUser', JSON.stringify(user));
            
            // Redirect to dashboard or home page
            window.location.href = 'dashboard.html';
        }, 2000);
    }
});

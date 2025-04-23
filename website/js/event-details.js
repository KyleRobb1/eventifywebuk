document.addEventListener('DOMContentLoaded', function() {
    // Booking modal functionality
    const bookTicketsBtn = document.getElementById('book-tickets-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    
    // Open booking modal
    if (bookTicketsBtn) {
        bookTicketsBtn.addEventListener('click', function() {
            bookingModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    // Close booking modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Quantity selector functionality
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.qty-input');
        
        minusBtn.addEventListener('click', function() {
            let value = parseInt(input.value);
            if (value > 0) {
                input.value = value - 1;
                updateSummary();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(input.value);
            if (value < parseInt(input.max)) {
                input.value = value + 1;
                updateSummary();
            }
        });
        
        input.addEventListener('change', function() {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 0) {
                input.value = 0;
            } else if (value > parseInt(input.max)) {
                input.value = input.max;
            }
            updateSummary();
        });
    });
    
    // Update payment summary
    function updateSummary() {
        const qtyInputs = document.querySelectorAll('.qty-input');
        const gaQty = parseInt(qtyInputs[0].value) || 0;
        const vipQty = parseInt(qtyInputs[1].value) || 0;
        
        const gaPrice = 59.99;
        const vipPrice = 149.99;
        const bookingFeePerTicket = 4.99;
        
        const gaTotal = gaQty * gaPrice;
        const vipTotal = vipQty * vipPrice;
        const totalTickets = gaQty + vipQty;
        const bookingFee = totalTickets > 0 ? totalTickets * bookingFeePerTicket : 0;
        const totalAmount = gaTotal + vipTotal + bookingFee;
        
        // Update summary display
        document.querySelector('.ga-qty').textContent = gaQty;
        document.querySelector('.vip-qty').textContent = vipQty;
        document.querySelector('.ga-total').textContent = `$${gaTotal.toFixed(2)}`;
        document.querySelector('.vip-total').textContent = `$${vipTotal.toFixed(2)}`;
        document.querySelector('.booking-fee').textContent = `$${bookingFee.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `$${totalAmount.toFixed(2)}`;
    }
    
    // Payment method toggle
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const creditCardDetails = document.getElementById('credit-card-details');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                creditCardDetails.style.display = 'block';
            } else {
                creditCardDetails.style.display = 'none';
            }
        });
    });
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const qtyInputs = document.querySelectorAll('.qty-input');
            const gaQty = parseInt(qtyInputs[0].value) || 0;
            const vipQty = parseInt(qtyInputs[1].value) || 0;
            
            if (gaQty === 0 && vipQty === 0) {
                alert('Please select at least one ticket.');
                return;
            }
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!name || !email || !phone) {
                alert('Please fill in all required attendee information.');
                return;
            }
            
            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
            
            if (selectedPayment === 'credit-card') {
                const cardNumber = document.getElementById('card-number').value.trim();
                const expiry = document.getElementById('expiry').value.trim();
                const cvv = document.getElementById('cvv').value.trim();
                const cardName = document.getElementById('card-name').value.trim();
                
                if (!cardNumber || !expiry || !cvv || !cardName) {
                    alert('Please fill in all credit card details.');
                    return;
                }
            }
            
            // Simulate booking process
            const bookingBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = bookingBtn.textContent;
            
            bookingBtn.disabled = true;
            bookingBtn.textContent = 'Processing...';
            
            // Simulate API call with timeout
            setTimeout(function() {
                // Create a success message
                const modalContent = document.querySelector('.booking-modal-content');
                modalContent.innerHTML = `
                    <div class="booking-success">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Booking Confirmed!</h2>
                        <p>Your tickets for Summer Music Festival have been booked successfully.</p>
                        <div class="booking-details">
                            <p><strong>Booking Reference:</strong> EVT-${Math.floor(100000 + Math.random() * 900000)}</p>
                            <p><strong>Date:</strong> May 25, 2025</p>
                            <p><strong>Tickets:</strong> ${gaQty > 0 ? `${gaQty} x General Admission` : ''} ${vipQty > 0 ? `${vipQty > 0 && gaQty > 0 ? ', ' : ''}${vipQty} x VIP Experience` : ''}</p>
                        </div>
                        <p>A confirmation email has been sent to ${email}</p>
                        <div class="action-buttons">
                            <button class="btn btn-primary" id="view-tickets-btn">View My Tickets</button>
                            <button class="btn btn-secondary" id="close-success-btn">Close</button>
                        </div>
                    </div>
                `;
                
                // Add styles for success message
                const style = document.createElement('style');
                style.textContent = `
                    .booking-success {
                        text-align: center;
                        padding: 20px;
                    }
                    .success-icon {
                        font-size: 5rem;
                        color: #4CAF50;
                        margin-bottom: 20px;
                    }
                    .booking-details {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                        text-align: left;
                    }
                    .booking-details p {
                        margin-bottom: 10px;
                    }
                    .action-buttons {
                        display: flex;
                        justify-content: center;
                        gap: 15px;
                        margin-top: 30px;
                    }
                `;
                document.head.appendChild(style);
                
                // Add event listeners for new buttons
                document.getElementById('view-tickets-btn').addEventListener('click', function() {
                    alert('This would navigate to the tickets page in a real application.');
                });
                
                document.getElementById('close-success-btn').addEventListener('click', function() {
                    bookingModal.style.display = 'none';
                    document.body.style.overflow = '';
                    
                    // Reload the page after a short delay
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                });
                
            }, 2000);
        });
    }
    
    // Share functionality
    const shareBtn = document.querySelector('.event-buttons .btn-secondary:nth-child(3)');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Summer Music Festival',
                    text: 'Join me at the Summer Music Festival on May 25, 2025!',
                    url: window.location.href
                })
                .catch(error => console.log('Error sharing:', error));
            } else {
                // Fallback for browsers that don't support Web Share API
                const shareUrl = window.location.href;
                const tempInput = document.createElement('input');
                document.body.appendChild(tempInput);
                tempInput.value = shareUrl;
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                alert('Link copied to clipboard! Share it with your friends.');
            }
        });
    }
    
    // Save/Favorite functionality
    const saveBtn = document.querySelector('.event-buttons .btn-secondary:nth-child(2)');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff6b6b';
                
                // Show saved notification
                const notification = document.createElement('div');
                notification.className = 'save-notification';
                notification.innerHTML = '<i class="fas fa-heart"></i> Added to favorites';
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '4px';
                notification.style.zIndex = '1000';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 500);
                }, 2000);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    }
});

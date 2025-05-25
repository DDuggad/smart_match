document.addEventListener('DOMContentLoaded', () => {
    // Logo interactions
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'rotate(5deg) scale(1.1)';
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'rotate(0) scale(1)';
        });
    }

    // Container fade-in animations
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';

        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }

    // Card staggered animations
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });

    // Form animations
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        const formGroups = formContainer.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(10px)';

            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
        });
    }

    // Toast notifications
    const showToast = (message, type = 'success', duration = 3000) => {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    };

    // Expose toast function globally
    window.showToast = showToast;
});

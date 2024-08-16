
        const menuIcon = document.getElementById('menuIcon');
        const navMenu = document.getElementById('navMenu');

        menuIcon.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuIcon.textContent = menuIcon.textContent === '☰' ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('nav')) {
                navMenu.classList.remove('show');
                menuIcon.textContent = '☰';
            }
        });
  
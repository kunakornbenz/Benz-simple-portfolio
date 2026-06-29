document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon between open/close (simple visual change)
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', false);
            });
        });
    }

    // ==========================================================================
    // CAMPAIGN ROI & CAC SIMULATOR
    // ==========================================================================
    const spendInput = document.getElementById('spend');
    const clicksInput = document.getElementById('clicks');
    const convRateInput = document.getElementById('convRate');
    const aovInput = document.getElementById('aov');

    const cpcOut = document.getElementById('cpcOut');
    const conversionsOut = document.getElementById('conversionsOut');
    const cacOut = document.getElementById('cacOut');
    const revenueOut = document.getElementById('revenueOut');
    const roasOut = document.getElementById('roasOut');
    const roiOut = document.getElementById('roiOut');
    const roiProgress = document.getElementById('roiProgress');

    const calculateROI = () => {
        // Parse inputs safely
        const spend = parseFloat(spendInput.value) || 0;
        const clicks = parseFloat(clicksInput.value) || 0;
        const convRate = parseFloat(convRateInput.value) || 0;
        const aov = parseFloat(aovInput.value) || 0;

        // 1. CPC Calculation
        const cpc = clicks > 0 ? (spend / clicks) : 0;
        
        // 2. Conversions Calculation
        const conversions = Math.round(clicks * (convRate / 100));

        // 3. CAC Calculation
        const cac = conversions > 0 ? (spend / conversions) : (spend > 0 ? spend : 0);

        // 4. Revenue Calculation
        const revenue = conversions * aov;

        // 5. ROAS Calculation
        const roas = spend > 0 ? (revenue / spend) : 0;

        // 6. ROI Calculation
        const roi = spend > 0 ? (((revenue - spend) / spend) * 100) : 0;

        // Update DOM Output Fields
        cpcOut.textContent = `$${cpc.toFixed(2)}`;
        conversionsOut.textContent = conversions.toLocaleString();
        cacOut.textContent = conversions > 0 ? `$${cac.toFixed(2)}` : 'N/A';
        revenueOut.textContent = `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        roasOut.textContent = `${roas.toFixed(1)}x`;
        roiOut.textContent = `${roi.toFixed(1)}%`;

        // Update Progress Bar Indicator
        updateROIProgressBar(roi);
    };

    const updateROIProgressBar = (roi) => {
        if (!roiProgress) return;

        // Determine filling width: map ROI from negative to positive.
        // Let's cap visual progress from -100% to +300% for aesthetic bar representation.
        let fillWidth = 0;
        if (roi <= -100) {
            fillWidth = 5; // minimal bar
        } else if (roi >= 300) {
            fillWidth = 100;
        } else {
            // Map [-100, 300] to [5%, 100%]
            fillWidth = 5 + ((roi + 100) / 400) * 95;
        }

        roiProgress.style.width = `${fillWidth}%`;

        // Color and glow status classes
        roiProgress.classList.remove('profitable', 'unprofitable');
        if (roi > 0) {
            roiProgress.classList.add('profitable');
        } else if (roi < 0) {
            roiProgress.classList.add('unprofitable');
        }
    };

    // Attach event listeners to all calculator inputs
    const inputs = [spendInput, clicksInput, convRateInput, aovInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateROI);
        }
    });

    // Run initial calculation on page load
    calculateROI();

    // ==========================================================================
    // CONTACT FORM CLIENT-SIDE HANDLING
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission status changes
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                // Hide Form and Show Success Alert
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                
                // Clear the form
                contactForm.reset();
            }, 1000);
        });
    }

    // ==========================================================================
    // EXTRA AESTHETIC: TERMINAL WHOAMI TYPING EFFECT ANIMATION RESTART
    // ==========================================================================
    const typedCommand = document.querySelector('.typed-command');
    if (typedCommand) {
        // Soft hover replay animation
        typedCommand.addEventListener('mouseover', () => {
            typedCommand.style.animation = 'none';
            // Trigger reflow to restart CSS transitions/animations
            void typedCommand.offsetWidth;
            typedCommand.style.animation = null;
        });
    }
});

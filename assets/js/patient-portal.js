// Patient Portal Dashboard logic: Tab Switching, Doctor Booking, Report Viewing, and Bill Payment
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.dashboard-nav-link');
    const contentSections = document.querySelectorAll('.dashboard-section');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('dashboard-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');

    if (!sidebarLinks.length || !contentSections.length) return;

    if (window.innerWidth < 1024) {
        hideSidebar();
    }

    function isRtl() {
        return document.documentElement.getAttribute('dir') === 'rtl';
    }
    function hideSidebar() {
        if (!sidebar) return;
        if (isRtl()) {
            sidebar.classList.add('translate-x-full');
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-full');
        }
    }
    function showSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('-translate-x-full', 'translate-x-full');
    }

    function switchTab(targetId) {
        sidebarLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('bg-primary/10', 'text-primary', 'border-primary');
                link.classList.remove('text-theme-muted', 'border-transparent', 'hover:bg-theme');
            } else {
                link.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
                link.classList.add('text-theme-muted', 'border-transparent', 'hover:bg-theme');
            }
        });

        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });

        if (window.innerWidth < 1024) {
            hideSidebar();
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId !== 'logout') {
                switchTab(targetId);
            } else {
                window.location.href = 'index.html';
            }
        });
    });

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', showSidebar);
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', hideSidebar);
    }

    const rtlToggle = document.getElementById('rtl-toggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            setTimeout(() => {
                if (window.innerWidth < 1024) {
                    hideSidebar();
                }
            }, 50);
        });
    }

    // Toast notification helper
    function showPortalToast(message) {
        const toast = document.getElementById('portalToast');
        const toastMsg = document.getElementById('portalToastMessage');
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.remove('hidden');
        clearTimeout(window.__portalToastTimer);
        window.__portalToastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // Doctor Search Filter inside Book Doctor section
    const portalDoctorSearch = document.getElementById('portalDoctorSearch');
    const portalDoctorCards = document.querySelectorAll('.portal-doctor-card');
    if (portalDoctorSearch && portalDoctorCards.length) {
        portalDoctorSearch.addEventListener('input', () => {
            const term = portalDoctorSearch.value.toLowerCase().trim();
            portalDoctorCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // Book Doctor Modal / Action
    const bookButtons = document.querySelectorAll('.book-doctor-btn');
    const appointmentsList = document.getElementById('myAppointmentsGrid');
    const appointmentCountStat = document.getElementById('statAppointmentsCount');
    const headerAppointmentBadge = document.getElementById('headerAppointmentBadge');

    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const doctorName = btn.getAttribute('data-doctor') || 'Specialist Doctor';
            const dept = btn.getAttribute('data-dept') || 'Consultation';
            const fee = btn.getAttribute('data-fee') || '$120';

            btn.textContent = 'Booked ✓';
            btn.classList.add('bg-primary', 'text-white', 'px-3', 'py-1.5', 'rounded-lg');
            btn.disabled = true;

            if (appointmentsList) {
                const card = document.createElement('div');
                card.className = 'bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm relative group';
                card.innerHTML = `
                    <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"><i data-lucide="calendar-check" class="w-6 h-6"></i></div>
                    <h3 class="font-bold text-base mb-2">${doctorName}</h3>
                    <p class="text-sm text-theme-muted mb-4">${dept} • Scheduled for Tomorrow, 10:30 AM (${fee})</p>
                    <div class="flex items-center justify-between text-sm font-medium border-t border-theme-border pt-4">
                        <span class="text-primary">Room 304, Wing B</span>
                        <span class="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Confirmed</span>
                    </div>
                `;
                appointmentsList.prepend(card);
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            if (appointmentCountStat) {
                const current = parseInt(appointmentCountStat.textContent, 10) || 2;
                appointmentCountStat.textContent = String(current + 1);
            }
            if (headerAppointmentBadge) {
                const current = parseInt(headerAppointmentBadge.textContent, 10) || 2;
                headerAppointmentBadge.textContent = `${current + 1} Upcoming Visits`;
            }

            showPortalToast(`Appointment confirmed with ${doctorName} (${dept}).`);
        });
    });

    // View Medical Report Modal
    const reportModal = document.getElementById('reportModal');
    const reportModalTitle = document.getElementById('reportModalTitle');
    const reportModalMeta = document.getElementById('reportModalMeta');
    const reportModalBody = document.getElementById('reportModalBody');
    const reportModalClose = document.getElementById('reportModalClose');

    document.querySelectorAll('.view-report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!reportModal) return;
            reportModalTitle.textContent = btn.getAttribute('data-report-title') || 'Diagnostic Report';
            reportModalMeta.textContent = btn.getAttribute('data-report-meta') || '';
            reportModalBody.textContent = btn.getAttribute('data-report-summary') || '';
            reportModal.classList.remove('hidden');
            reportModal.classList.add('flex');
        });
    });

    if (reportModalClose && reportModal) {
        reportModalClose.addEventListener('click', () => {
            reportModal.classList.add('hidden');
            reportModal.classList.remove('flex');
        });
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                reportModal.classList.add('hidden');
                reportModal.classList.remove('flex');
            }
        });
    }

    // Pay Hospital Bills
    let outstandingAmount = 240;
    const balanceEl = document.getElementById('outstandingBalance');
    const statBillsEl = document.getElementById('statBillsBalance');
    const payAllBtn = document.getElementById('payAllBillsBtn');

    function updateBalanceDisplay() {
        if (balanceEl) {
            balanceEl.innerHTML = `$${outstandingAmount.toFixed(2)} <span class="text-2xl font-medium">USD</span>`;
        }
        if (statBillsEl) {
            statBillsEl.textContent = `$${outstandingAmount}`;
        }
    }

    document.querySelectorAll('.pay-invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            const amount = parseFloat(btn.getAttribute('data-amount') || '0');
            const invoiceId = btn.getAttribute('data-invoice') || 'Invoice';
            outstandingAmount = Math.max(0, outstandingAmount - amount);
            updateBalanceDisplay();

            const row = btn.closest('tr');
            const statusBadge = row ? row.querySelector('.invoice-status-badge') : null;
            if (statusBadge) {
                statusBadge.textContent = 'Paid';
            }
            btn.textContent = 'Receipt';
            btn.classList.remove('bg-primary', 'text-white', 'px-3', 'py-1', 'rounded-lg');
            btn.classList.add('text-theme-muted');
            btn.disabled = true;

            showPortalToast(`Payment of $${amount.toFixed(2)} completed for ${invoiceId}.`);
        });
    });

    if (payAllBtn) {
        payAllBtn.addEventListener('click', () => {
            if (outstandingAmount <= 0) {
                showPortalToast('All hospital bills are already paid.');
                return;
            }
            document.querySelectorAll('.pay-invoice-btn:not(:disabled)').forEach(btn => btn.click());
        });
    }

    // Form submit feedback inside portal
    document.querySelectorAll('.portal-action-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = form.getAttribute('data-success-msg') || 'Your request has been submitted.';
            showPortalToast(msg);
            form.reset();
        });
    });
});


// Client-side search, department filter, and sorting logic for Doctors page
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('doctorSearch');
    const departmentFilter = document.getElementById('departmentFilter');
    const doctorSort = document.getElementById('doctorSort');
    const deptPills = document.querySelectorAll('.dept-pill');
    const doctorCards = Array.from(document.querySelectorAll('.doctor-card'));
    const doctorsGrid = document.getElementById('doctorsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!searchInput || !departmentFilter || doctorCards.length === 0) return;

    function updatePillStyles(activeDept) {
        deptPills.forEach(pill => {
            const pillDept = pill.getAttribute('data-dept').toLowerCase();
            if (pillDept === activeDept) {
                pill.classList.add('bg-primary', 'text-white', 'border-primary');
                pill.classList.remove('border-theme-border', 'text-theme-text', 'hover:bg-theme-card');
            } else {
                pill.classList.remove('bg-primary', 'text-white', 'border-primary');
                pill.classList.add('border-theme-border', 'text-theme-text', 'hover:bg-theme-card');
            }
        });
    }

    function filterDoctors() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const department = departmentFilter.value.toLowerCase();
        let visibleCount = 0;

        doctorCards.forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const cardDept = (card.getAttribute('data-category') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();
            const doctor = (card.getAttribute('data-doctor') || '').toLowerCase();

            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm) || doctor.includes(searchTerm) || cardDept.includes(searchTerm);
            const matchesDepartment = department === 'all' || cardDept === department;

            if (matchesSearch && matchesDepartment) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.classList.remove('hidden');
            } else {
                emptyState.classList.add('hidden');
            }
        }
    }

    function sortDoctors() {
        if (!doctorSort || !doctorsGrid) return;
        const sortBy = doctorSort.value;
        const sorted = [...doctorCards].sort((a, b) => {
            if (sortBy === 'rating') {
                return parseFloat(b.getAttribute('data-rating') || '0') - parseFloat(a.getAttribute('data-rating') || '0');
            }
            if (sortBy === 'experience') {
                return parseInt(b.getAttribute('data-experience') || '0', 10) - parseInt(a.getAttribute('data-experience') || '0', 10);
            }
            return parseInt(a.getAttribute('data-order') || '0', 10) - parseInt(b.getAttribute('data-order') || '0', 10);
        });
        sorted.forEach(card => doctorsGrid.appendChild(card));
    }

    deptPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const dept = pill.getAttribute('data-dept').toLowerCase();
            departmentFilter.value = dept;
            updatePillStyles(dept);
            filterDoctors();
        });
    });

    departmentFilter.addEventListener('change', () => {
        updatePillStyles(departmentFilter.value.toLowerCase());
        filterDoctors();
    });

    searchInput.addEventListener('input', filterDoctors);

    if (doctorSort) {
        doctorSort.addEventListener('change', sortDoctors);
    }
});


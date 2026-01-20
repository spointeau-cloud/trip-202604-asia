// =====================
// TABLE FILTER & PAGINATION
// =====================

const TableFilter = {
  currentPage: 1,
  itemsPerPage: 10,
  filteredRows: [],
  allRows: [],

  init() {
		this.allRows = Array.from(document.querySelectorAll('#budget-table tbody tr[data-category]'));
		this.filteredRows = [...this.allRows];

		this.populateFilterOptions();
		this.attachEventListeners();
		this.setupFilterToggle(); // Add this line
		this.applyFilters();
	},

	setupFilterToggle() {
		const toggleBtn = document.getElementById('toggle-filters');
		const filterPanel = document.getElementById('filter-panel');
		const toggleText = toggleBtn.querySelector('.toggle-text');

		if (!toggleBtn || !filterPanel) return;

		toggleBtn.addEventListener('click', () => {
			const isCollapsed = filterPanel.classList.contains('collapsed');
			
			if (isCollapsed) {
				filterPanel.classList.remove('collapsed');
				filterPanel.classList.add('expanded');
				toggleText.textContent = 'Hide Filters';
			} else {
				filterPanel.classList.remove('expanded');
				filterPanel.classList.add('collapsed');
				toggleText.textContent = 'Show Filters';
			}
		});
	},

  populateFilterOptions() {
    const categories = new Set();
    const countries = new Set();
    const cities = new Set();
    const subcategories = new Set();
    const participants = new Set();

    this.allRows.forEach(row => {
      // Category
      const category = row.dataset.category;
      if (category) categories.add(category);

      // Country
      const countryCell = row.querySelector('[data-country]');
      if (countryCell && countryCell.textContent.trim()) {
        countries.add(countryCell.textContent.trim());
      }

      // City
      const cityCell = row.querySelector('[data-city]');
      if (cityCell && cityCell.textContent.trim()) {
        cities.add(cityCell.textContent.trim());
      }

      // Subcategory
      const subcategoryCell = row.querySelector('[data-subcategory]');
      if (subcategoryCell && subcategoryCell.textContent.trim()) {
        subcategories.add(subcategoryCell.textContent.trim());
      }

      // Participants
      const participantsCell = row.querySelector('[data-participants]');
      if (participantsCell) {
        const parts = participantsCell.textContent.split(',');
        parts.forEach(p => {
          const person = PEOPLE[p.trim()];
          if (person) participants.add(`${p.trim()}:${person.label}`);
        });
      }
    });

    // Populate selects
    this.populateSelect('filter-category', Array.from(categories).sort());
    this.populateSelect('filter-country', Array.from(countries).sort());
    this.populateSelect('filter-city', Array.from(cities).sort());
    this.populateSelect('filter-subcategory', Array.from(subcategories).sort());
    
    // Participants with friendly names
    const participantOptions = Array.from(participants).sort((a, b) => {
      const labelA = a.split(':')[1];
      const labelB = b.split(':')[1];
      return labelA.localeCompare(labelB);
    });
    this.populateSelect('filter-participant', participantOptions, true);
  },

  populateSelect(selectId, options, isParticipant = false) {
    const select = document.getElementById(selectId);
    if (!select) return;

    options.forEach(option => {
      const opt = document.createElement('option');
      if (isParticipant) {
        const [id, label] = option.split(':');
        opt.value = id;
        opt.textContent = label;
      } else {
        opt.value = option;
        opt.textContent = option;
      }
      select.appendChild(opt);
    });
  },

  attachEventListeners() {
		// Filter inputs
		['filter-date-from', 'filter-date-to', 'filter-category', 'filter-country', 'filter-city', 
		 'filter-description', 'filter-subcategory', 'filter-participant'].forEach(id => {
			const element = document.getElementById(id);
			if (element) {
				element.addEventListener('input', () => this.applyFilters());
				element.addEventListener('change', () => this.applyFilters());
			}
		});

    // Reset button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // Pagination will be added dynamically
  },

  applyFilters() {
		const filters = {
			dateFrom: document.getElementById('filter-date-from')?.value || '',
			dateTo: document.getElementById('filter-date-to')?.value || '',
			category: document.getElementById('filter-category')?.value || '',
			country: document.getElementById('filter-country')?.value || '',
			city: document.getElementById('filter-city')?.value || '',
			description: document.getElementById('filter-description')?.value.toLowerCase() || '',
			subcategory: document.getElementById('filter-subcategory')?.value || '',
			participant: document.getElementById('filter-participant')?.value || ''
		};

		this.filteredRows = this.allRows.filter(row => {
			// Date range filter
			if (filters.dateFrom || filters.dateTo) {
				const dateCell = row.querySelector('[data-date]');
				if (!dateCell) return false;
				
				const rowDate = dateCell.textContent.trim();
				
				if (filters.dateFrom && rowDate < filters.dateFrom) {
					return false;
				}
				
				if (filters.dateTo && rowDate > filters.dateTo) {
					return false;
				}
			}

      // Category filter
      if (filters.category && row.dataset.category !== filters.category) {
        return false;
      }

      // Country filter
      if (filters.country) {
        const countryCell = row.querySelector('[data-country]');
        if (!countryCell || countryCell.textContent.trim() !== filters.country) {
          return false;
        }
      }

      // City filter
      if (filters.city) {
        const cityCell = row.querySelector('[data-city]');
        if (!cityCell || cityCell.textContent.trim() !== filters.city) {
          return false;
        }
      }

      // Description filter
      if (filters.description) {
        const descCell = row.querySelector('[data-description]');
        if (!descCell || !descCell.textContent.toLowerCase().includes(filters.description)) {
          return false;
        }
      }

      // Subcategory filter
      if (filters.subcategory) {
        const subCatCell = row.querySelector('[data-subcategory]');
        if (!subCatCell || subCatCell.textContent.trim() !== filters.subcategory) {
          return false;
        }
      }

      // Participant filter
      if (filters.participant) {
        const partCell = row.querySelector('[data-participants]');
        if (!partCell) return false;
        const participants = partCell.textContent.split(',').map(p => p.trim());
        if (!participants.includes(filters.participant)) {
          return false;
        }
      }

      return true;
    });

    this.currentPage = 1;
    this.renderTable();
    this.updatePagination();
  },

  renderTable() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    // Hide all rows first
    this.allRows.forEach(row => {
      row.classList.add('filtered-out');
    });

    // Show filtered rows for current page
    const rowsToShow = this.filteredRows.slice(start, end);
    rowsToShow.forEach(row => {
      row.classList.remove('filtered-out');
    });

    // Update count
    const showingCount = document.getElementById('showing-count');
    if (showingCount) {
      const total = this.filteredRows.length;
      const showing = Math.min(end, total);
      showingCount.textContent = `Showing ${start + 1}-${showing} of ${total} expenses`;
    }

    // Recalculate visible totals
    this.updateVisibleTotals();
  },

  updateVisibleTotals() {
    const totalRow = document.querySelector('.table-total-row');
    if (!totalRow) return;

    let visibleTotal = 0;
    this.filteredRows.forEach(row => {
      const totalCell = row.querySelector('[data-total]');
      if (totalCell && totalCell.dataset.eur) {
        visibleTotal += Number(totalCell.dataset.eur);
      }
    });

    const grandTotalCell = totalRow.querySelector('[data-total-row]');
    if (grandTotalCell) {
      grandTotalCell.dataset.eur = visibleTotal;
      grandTotalCell.textContent = format(visibleTotal);
    }

    // Update the showing count to include total
    const showingCount = document.getElementById('showing-count');
    if (showingCount) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = Math.min(start + this.itemsPerPage, this.filteredRows.length);
      const symbol = getCurrencySymbol();
      showingCount.textContent = `Showing ${start + 1}-${end} of ${this.filteredRows.length} expenses (Total: ${symbol}${format(visibleTotal)})`;
    }
  },

  updatePagination() {
    const totalPages = Math.ceil(this.filteredRows.length / this.itemsPerPage);
    const paginationControls = document.getElementById('pagination-controls');
    
    if (!paginationControls) return;
    
    paginationControls.innerHTML = '';

    if (totalPages <= 1) return;

    // Items per page selector
    const perPageSelect = document.createElement('select');
    perPageSelect.id = 'items-per-page';
    perPageSelect.innerHTML = `
      <option value="10" ${this.itemsPerPage === 10 ? 'selected' : ''}>10/page</option>
      <option value="20" ${this.itemsPerPage === 20 ? 'selected' : ''}>20/page</option>
      <option value="50" ${this.itemsPerPage === 50 ? 'selected' : ''}>50/page</option>
      <option value="100" ${this.itemsPerPage === 100 ? 'selected' : ''}>100/page</option>
      <option value="${this.filteredRows.length}">All</option>
    `;
    perPageSelect.addEventListener('change', (e) => {
      this.itemsPerPage = parseInt(e.target.value);
      this.currentPage = 1;
      this.renderTable();
      this.updatePagination();
    });
    paginationControls.appendChild(perPageSelect);

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '‹ Prev';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTable();
        this.updatePagination();
      }
    });
    paginationControls.appendChild(prevBtn);

    // Page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      const firstBtn = this.createPageButton(1);
      paginationControls.appendChild(firstBtn);
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-info';
        paginationControls.appendChild(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = this.createPageButton(i);
      paginationControls.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-info';
        paginationControls.appendChild(ellipsis);
      }
      const lastBtn = this.createPageButton(totalPages);
      paginationControls.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next ›';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = this.currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderTable();
        this.updatePagination();
      }
    });
    paginationControls.appendChild(nextBtn);
  },

  createPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.textContent = pageNum;
    btn.className = 'pagination-btn';
    if (pageNum === this.currentPage) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      this.currentPage = pageNum;
      this.renderTable();
      this.updatePagination();
    });
    return btn;
  },

  resetFilters() {
		document.getElementById('filter-date-from').value = '';
		document.getElementById('filter-date-to').value = '';
		document.getElementById('filter-category').value = '';
		document.getElementById('filter-country').value = '';
		document.getElementById('filter-city').value = '';
		document.getElementById('filter-description').value = '';
		document.getElementById('filter-subcategory').value = '';
		document.getElementById('filter-participant').value = '';
		
		this.applyFilters();
	},

  // Called when currency changes
  refreshTotals() {
    this.updateVisibleTotals();
  }
};

// Make it available globally for currency changes
window.TableFilter = TableFilter;
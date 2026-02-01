// =====================
// CONFIGURATION
// =====================

const PEOPLE = {
  "ste": { label: 'Stéphane', type: 'Adult', sex: 'Male', country: 'France' },
  "fra": { label: 'Françoise', type: 'Adult', sex: 'Female', country: 'France' },
  "car": { label: 'Caroline', type: 'Adult', sex: 'Female', country: 'Philippines' },
  "raf": { label: 'Rafael', type: 'Child', sex: 'Male', country: 'Philippines' },
  "rom": { label: 'Rommel', type: 'Adult', sex: 'Male', country: 'Philippines' },
  "chr": { label: 'Chris', type: 'Adult', sex: 'Female', country: 'Philippines' },
  "vin": { label: 'Vincent', type: 'Adult', sex: 'Male', country: 'Philippines' },
  "gab": { label: 'Gabriel', type: 'Adult', sex: 'Male', country: 'Philippines' },
	"pj":  { label: 'Paul John', type: 'Adult', sex: 'Male', country: 'Philippines' },
	"pri": { label: 'Priyanka', type: 'Adult', sex: 'Female', country: 'Philippines' }
};

const CATEGORY_COLORS = {
  "Flights (all)": '#1565c0',
  "Flights (🇫🇷)": '#1565c0',
  "Flights (🇵🇭)": '#1565c0',
  "Trains": '#2e7d32',
  "Transport": '#f57f17',
  "Hotel": '#6a1b9a',
  "Food": '#e65100',
  "Activities": '#00695c'
};

const CURRENCIES = {
  EUR: { symbol: '€', rate: 1 },
  USD: { symbol: '$', rate: 1.16 },
  PHP: { symbol: '₱', rate: 68.77 }
};

// =====================
// STATE
// =====================

let currentCurrency = 'EUR';
let categoryChartData = [];
let personChartData = { categories: [], series: [], totals: [] };

const charts = {
  category: null,
  person: null
};

// =====================
// CURRENCY HELPERS
// =====================

function convert(amountEUR) {
  return amountEUR * CURRENCIES[currentCurrency].rate;
}

function format(amountEUR) {
  return convert(amountEUR).toFixed(2);
}

function getCurrencySymbol() {
  return CURRENCIES[currentCurrency].symbol;
}

// =====================
// TABLE PROCESSING
// =====================

function normalizeEuroValues() {
  const moneyCells = document.querySelectorAll(
    '[data-price-night], [data-price-adult], [data-price-child], [data-total], [data-total-row]'
  );

  moneyCells.forEach(cell => {
    if (cell.dataset.eur) return;

    const rawText = cell.textContent.trim();
    if (!rawText) return;

    const normalized = rawText
      .replace('€', '')
      .replace(',', '.')
      .replace(/\s/g, '');

    const value = Number(normalized);
    if (!isNaN(value)) {
      cell.dataset.eur = value;
    }
  });
}

function calculateRowTotals() {
	// Get symbol
	const symbol = getCurrencySymbol();
	
  const tbody = document.querySelector('#budget-table tbody');
  const rows = tbody.querySelectorAll('tr[data-category]');
  const categoryTotals = {};
  let grandTotal = 0;

  rows.forEach(row => {
    const priceAdult = Number(row.querySelector('[data-price-adult]').textContent);
    const priceChild = Number(row.querySelector('[data-price-child]').textContent);
    const priceNight = Number(row.querySelector('[data-price-night]').textContent);
    const nights = Number(row.querySelector('[data-qty-nights]').textContent);

    const participants = row.querySelector('[data-participants]').textContent.split(',');

    let adults = 0;
    let children = 0;

    participants.forEach(personId => {
      const person = PEOPLE[personId];
      if (!person) return;

      if (person.type === 'Adult') adults++;
      if (person.type === 'Child') children++;
    });

    const total = (priceAdult * adults) + (priceChild * children) + (priceNight * nights);

    const totalCell = row.querySelector('[data-total]');
    totalCell.textContent = total.toFixed(2);
    totalCell.dataset.eur = total;
		
		//row.querySelector('[data-price-adult]').textContent = `${symbol}` + priceAdult.toFixed(2);
		//row.querySelector('[data-price-child]').textContent = `${symbol}` + priceChild.toFixed(2);
		//row.querySelector('[data-price-night]').textContent = `${symbol}` + priceNight.toFixed(2);
    
    grandTotal += total;

    const category = row.dataset.category;
    categoryTotals[category] = (categoryTotals[category] || 0) + total;
  });

  // Add total row
  const existingTotalRow = tbody.querySelector('.table-total-row');
  if (existingTotalRow) {
    existingTotalRow.remove();
  }

  const totalRow = document.createElement('tr');
  totalRow.classList.add('table-total-row');
  totalRow.innerHTML = `
    <td colspan="8"><strong>Total</strong></td>
    <td class="table-grand-total" data-total-row data-eur="${grandTotal}">${symbol}${grandTotal.toFixed(2)}</td>
    <td></td>
  `;
  tbody.appendChild(totalRow);

  return { categoryTotals, grandTotal };
}

function refreshTableCurrency() {
	// Get symbol
	const symbol = getCurrencySymbol();
	
  // Update all EUR-based cells (price columns)
  document.querySelectorAll('[data-price-night], [data-price-adult], [data-price-child]').forEach(cell => {
    const eur = Number(cell.dataset.eur);
    cell.textContent = `${symbol}` + format(eur);
  });

  // Update row totals
  document.querySelectorAll('[data-total]').forEach(cell => {
    const eur = Number(cell.dataset.eur);
    cell.textContent = `${symbol}` + format(eur);
  });

  // Update grand total
  const grandTotalCell = document.querySelector('[data-total-row]');
  if (grandTotalCell) {
    const eur = Number(grandTotalCell.dataset.eur);
    grandTotalCell.textContent = `${symbol}` + format(eur);
  }

  // Update column headers
  document.querySelector('[data-col-price-night]').textContent = `Price / Night (${symbol})`;
  document.querySelector('[data-col-price-adult]').textContent = `Price / Adult (${symbol})`;
  document.querySelector('[data-col-price-child]').textContent = `Price / Rafael (${symbol})`;
  document.querySelector('[data-col-total]').textContent = `Total (${symbol})`;
}

// =====================
// CHART DATA PREPARATION
// =====================

function prepareCategoryChartData(categoryTotals) {
  categoryChartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      itemStyle: {
        color: CATEGORY_COLORS[name] || '#999'
      }
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function preparePersonChartData() {
  const rows = document.querySelectorAll('#budget-table tbody tr[data-category]');
  const personTotals = {};
  const categoriesSet = new Set();

  Object.keys(PEOPLE).forEach(personId => {
    personTotals[personId] = {};
  });

  rows.forEach(row => {
    const category = row.dataset.category;
    categoriesSet.add(category);

    const participants = row.querySelector('[data-participants]').textContent.split(',');
    const rowTotal = Number(row.querySelector('.row-total').textContent);
    const share = rowTotal / participants.length;

    participants.forEach(personId => {
      if (!PEOPLE[personId]) return;
      personTotals[personId][category] = (personTotals[personId][category] || 0) + share;
    });
  });

  const categories = Array.from(categoriesSet).sort();

  const series = categories.map(category => ({
    name: category,
    type: 'bar',
    stack: 'total',
    emphasis: { focus: 'series' },
    itemStyle: {
      color: CATEGORY_COLORS[category] || '#999' // Add color here
    },
    data: Object.keys(PEOPLE).map(personId =>
      +(personTotals[personId][category] || 0).toFixed(2)
    )
  }));

  const totals = Object.keys(PEOPLE).map(personId =>
    categories.reduce((sum, cat) => sum + (personTotals[personId][cat] || 0), 0)
  );

  personChartData = { categories, series, totals };
}

// =====================
// CHART INITIALIZATION
// =====================

function createCategoryChart() {
  const chartDom = document.getElementById('budget-by-category');
  charts.category = echarts.init(chartDom);

  updateCategoryChart();
}

function createPersonChart() {
  const chartDom = document.getElementById('budget-by-person');
  charts.person = echarts.init(chartDom);

  updatePersonChart();
}

// =====================
// CHART UPDATES
// =====================

function updateCategoryChart() {
  const symbol = getCurrencySymbol();

  // Convert data to current currency
  const convertedData = categoryChartData.map(item => ({
    ...item,
    value: convert(item.value)
  }));

  charts.category.setOption({
    tooltip: {
      trigger: 'item',
      formatter: params => {
        const value = params.value.toFixed(2);
        return `${params.name}: ${symbol}${value} (${params.percent}%)`;
      }
    },
    legend: {
      top: 'bottom'
    },
    series: [{
      name: 'Budget by category',
      type: 'pie',
      radius: ['25%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: params => `${params.name}\n${symbol}${params.value.toFixed(0)}`
      },
      data: convertedData
    }]
  });
}

function updatePersonChart() {
  const symbol = getCurrencySymbol();
  const isMobile = window.innerWidth < 768;

  // Convert series data to current currency
  const convertedSeries = personChartData.series.map((s, index) => ({
    ...s,
    data: s.data.map(v => convert(v)),
    label: index === personChartData.series.length - 1
      ? {
          show: true,
          position: isMobile ? 'right' : 'top',
          formatter: params => {
            const total = convert(personChartData.totals[params.dataIndex]);
            return `${symbol}${total.toFixed(0)}`;
          }
        }
      : { show: false }
  }));

  charts.person.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: params => {
        let total = 0;
        let content = `<strong>${params[0].axisValue}</strong><br/>`;

        params.forEach(p => {
          if (p.value > 0) {
            total += p.value;
            content += `${p.marker} ${p.seriesName}: ${symbol}${p.value.toFixed(2)}<br/>`;
          }
        });

        content += `<strong>Total: ${symbol}${total.toFixed(2)}</strong>`;
        return content;
      }
    },
    legend: {
      top: isMobile ? 'bottom' : 'bottom',
      type: isMobile ? 'scroll' : 'plain',
			orient: isMobile ? 'horizontal' : 'horizontal',
			left: isMobile ? 'center' : 'center',
      //show: !isMobile // Hide legend on mobile, info available in tooltip
    },
    grid: {
      left: isMobile ? '3%' : '3%',
      right: isMobile ? '3%' : '3%',
      top: isMobile ? '3%' : '3%',
      bottom: isMobile ? '12%' : '12%',
      containLabel: true
    },
    xAxis: {
      type: isMobile ? 'value' : 'category',
      data: isMobile ? undefined : Object.keys(PEOPLE).map(id => PEOPLE[id].label),
      axisLabel: isMobile ? undefined : {
        rotate: window.innerWidth < 480 ? 45 : 0 // Rotate on very small screens if vertical
      }
    },
    yAxis: {
      type: isMobile ? 'category' : 'value',
      data: isMobile ? Object.keys(PEOPLE).map(id => PEOPLE[id].label) : undefined,
      axisLabel: {
        fontSize: isMobile ? 11 : 12
      }
    },
    series: convertedSeries
  });
}

// =====================
// EVENT HANDLERS
// =====================

function handleCurrencyChange(e) {
  currentCurrency = e.target.value;
  
  refreshTableCurrency();
  updateCategoryChart();
  updatePersonChart();
  
  // Refresh filtered totals
  if (window.TableFilter) {
    TableFilter.refreshTotals();
  }
}

function handleChartToggle(e) {
  const showPerson = e.target.value === 'person';

  document.getElementById('budget-by-category').style.display = showPerson ? 'none' : 'block';
  document.getElementById('budget-by-person').style.display = showPerson ? 'block' : 'none';

  requestAnimationFrame(() => {
    charts[showPerson ? 'person' : 'category'].resize();
  });
}

function handleResize() {
  Object.values(charts).forEach(chart => {
    if (chart) chart.resize();
  });
  
  // Re-render person chart to adjust layout for new screen size
  if (charts.person) {
    updatePersonChart();
  }
}

// =====================
// INITIALIZATION
// =====================

function init() {
  // Normalize EUR values first
  normalizeEuroValues();

  // Calculate totals and prepare data
  const { categoryTotals } = calculateRowTotals();
  prepareCategoryChartData(categoryTotals);
  preparePersonChartData();

  // Create charts
  createCategoryChart();
  createPersonChart();

  // Set up event listeners
  document.getElementById('currency-selector').addEventListener('change', handleCurrencyChange);
  document.getElementById('chart-selector').addEventListener('change', handleChartToggle);
  window.addEventListener('resize', handleResize);

  // Initial display setup
  document.getElementById('budget-by-person').style.display = 'none';
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// =====================
// MOBILE CARD ACCORDION
// =====================

function initMobileAccordion() {
  if (window.innerWidth > 768) return;

  const rows = document.querySelectorAll('#budget-table tbody tr[data-category]');
  
  rows.forEach(row => {
    // Skip if already initialized
    if (row.classList.contains('accordion-initialized')) return;
    
    row.classList.add('accordion-initialized');
    row.classList.add('collapsed');
    
    row.addEventListener('click', function(e) {
      // Don't toggle if clicking on a link
      if (e.target.tagName === 'A') return;
      
      this.classList.toggle('collapsed');
      this.classList.toggle('expanded');
    });
  });
}

// Call on load and resize
function handleResize() {
  Object.values(charts).forEach(chart => {
    if (chart) chart.resize();
  });
  
  if (charts.person) {
    updatePersonChart();
  }
  
  // Re-init accordion on resize
  initMobileAccordion();
}

// Update init function
function init() {
  normalizeEuroValues();

  const { categoryTotals } = calculateRowTotals();
  prepareCategoryChartData(categoryTotals);
  preparePersonChartData();

  createCategoryChart();
  createPersonChart();

  document.getElementById('currency-selector').addEventListener('change', handleCurrencyChange);
  document.getElementById('chart-selector').addEventListener('change', handleChartToggle);
  window.addEventListener('resize', handleResize);

  document.getElementById('budget-by-person').style.display = 'none';
  
  // Initialize mobile accordion
  initMobileAccordion();
	
	// Initialize table filter
	if (window.TableFilter) {
		TableFilter.init();
	}
}

document.addEventListener('DOMContentLoaded', init);
// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const days = [
	{ date:'Apr 10', city:'Marseille', flag:'🇫🇷', min:12, max:16, rain:30, humidity:75, sunrise:'07:05', sunset:'20:15' },
	
  // Vietnam — Ho Chi Minh City (Apr 11–12)
  { date:'Apr 11', city:'Ho Chi Minh City', flag:'🇻🇳', min:25, max:34, rain:20, humidity:78, sunrise:'05:44', sunset:'18:09' },
  { date:'Apr 12', city:'Ho Chi Minh City', flag:'🇻🇳', min:26, max:35, rain:25, humidity:79, sunrise:'05:44', sunset:'18:09' },

  // Vietnam — Da Nang (Apr 13–15)
  { date:'Apr 13', city:'Da Nang',          flag:'🇻🇳', min:24, max:32, rain:18, humidity:75, sunrise:'05:31', sunset:'18:06' },
  { date:'Apr 14', city:'Da Nang',          flag:'🇻🇳', min:23, max:32, rain:15, humidity:73, sunrise:'05:31', sunset:'18:06' },
  { date:'Apr 15', city:'Da Nang',          flag:'🇻🇳', min:23, max:33, rain:18, humidity:72, sunrise:'05:30', sunset:'18:06' },

  // Vietnam — Hoi An (Apr 16–18)
  { date:'Apr 16', city:'Hoi An',           flag:'🇻🇳', min:23, max:31, rain:14, humidity:73, sunrise:'05:29', sunset:'18:05' },
  { date:'Apr 17', city:'Hoi An',           flag:'🇻🇳', min:22, max:31, rain:14, humidity:74, sunrise:'05:29', sunset:'18:05' },
  { date:'Apr 18', city:'Hoi An',           flag:'🇻🇳', min:22, max:32, rain:15, humidity:73, sunrise:'05:28', sunset:'18:05' },

  // Vietnam — Hanoi (Apr 19–23)
  { date:'Apr 19', city:'Hanoi',            flag:'🇻🇳', min:21, max:29, rain:28, humidity:74, sunrise:'05:22', sunset:'18:14' },
  { date:'Apr 20', city:'Hanoi',            flag:'🇻🇳', min:21, max:28, rain:32, humidity:76, sunrise:'05:21', sunset:'18:14' },
  { date:'Apr 21', city:'Hanoi',            flag:'🇻🇳', min:20, max:27, rain:35, humidity:78, sunrise:'05:21', sunset:'18:14' },
  { date:'Apr 22', city:'Hanoi',            flag:'🇻🇳', min:20, max:26, rain:30, humidity:77, sunrise:'05:20', sunset:'18:15' },
  { date:'Apr 23', city:'Hanoi',            flag:'🇻🇳', min:21, max:28, rain:28, humidity:75, sunrise:'05:20', sunset:'18:15' },

  // Laos — Luang Prabang (Apr 24–27)
  { date:'Apr 24', city:'Luang Prabang',    flag:'🇱🇦', min:22, max:35, rain:10, humidity:63, sunrise:'05:52', sunset:'18:29' },
  { date:'Apr 25', city:'Luang Prabang',    flag:'🇱🇦', min:24, max:36, rain:10, humidity:62, sunrise:'05:52', sunset:'18:29' },
  { date:'Apr 26', city:'Luang Prabang',    flag:'🇱🇦', min:24, max:37, rain:12, humidity:62, sunrise:'05:51', sunset:'18:30' },
  { date:'Apr 27', city:'Luang Prabang',    flag:'🇱🇦', min:23, max:37, rain:15, humidity:64, sunrise:'05:51', sunset:'18:30' },

  // Laos — Vientiane (Apr 28–May 2)
  { date:'Apr 28', city:'Vientiane',        flag:'🇱🇦', min:24, max:36, rain:18, humidity:65, sunrise:'05:50', sunset:'18:30' },
  { date:'Apr 29', city:'Vientiane',        flag:'🇱🇦', min:25, max:37, rain:22, humidity:67, sunrise:'05:50', sunset:'18:31' },
  { date:'Apr 30', city:'Vientiane',        flag:'🇱🇦', min:26, max:38, rain:25, humidity:68, sunrise:'05:49', sunset:'18:31' },
  { date:'May 1',  city:'Vientiane',        flag:'🇱🇦', min:26, max:38, rain:30, humidity:70, sunrise:'05:49', sunset:'18:31' },
  { date:'May 2',  city:'Vientiane',        flag:'🇱🇦', min:25, max:37, rain:28, humidity:69, sunrise:'05:48', sunset:'18:31' },
	
	{ date:'May 3', city:'Marseille', flag:'🇫🇷', min:18, max:21, rain:20, humidity:60, sunrise:'06:28', sunset:'20:42' },
];

// ── City metadata (colour, date range for markArea & legend) ──
const cities = [
  { name:'Marseille', flag:'🇫🇷', start:'Apr 10', end:'Apr 10', color:'rgba(100,200,100,0.13)',  pill:'#ef7350', label:'Marseille' },
  { name:'Ho Chi Minh City', flag:'🇻🇳', start:'Apr 11', end:'Apr 12', color:'rgba(239,115,80,0.13)',  pill:'#ef7350', label:'Ho Chi Minh' },
  { name:'Da Nang',          flag:'🇻🇳', start:'Apr 13', end:'Apr 15', color:'rgba(255,178,80,0.13)',  pill:'#ffb250', label:'Da Nang'     },
  { name:'Hoi An',           flag:'🇻🇳', start:'Apr 16', end:'Apr 18', color:'rgba(255,215,60,0.13)',  pill:'#ffd73c', label:'Hoi An'      },
  { name:'Hanoi',            flag:'🇻🇳', start:'Apr 19', end:'Apr 23', color:'rgba(100,170,240,0.13)', pill:'#64aaf0', label:'Hanoi'       },
  { name:'Luang Prabang',    flag:'🇱🇦', start:'Apr 24', end:'Apr 27', color:'rgba(180,120,240,0.14)', pill:'#b478f0', label:'Luang Prabang' },
  { name:'Vientiane',        flag:'🇱🇦', start:'Apr 28', end:'May 2',  color:'rgba(234,153,102,0.15)', pill:'#ea9966', label:'Vientiane'   },
];

// ═══════════════════════════════════════════════════════
// BUILD CITY LEGEND PILLS
// ═══════════════════════════════════════════════════════
const legendEl = document.getElementById('cityLegend');
cities.forEach(c => {
  const pill = document.createElement('div');
  pill.className = 'city-pill';
  pill.style.background = c.color.replace('0.13','0.18').replace('0.14','0.18').replace('0.15','0.18');
  pill.style.borderColor = c.pill + '55';
  pill.innerHTML = `
    <div class="city-pill-dot" style="background:${c.pill}"></div>
    ${c.flag} ${c.label}
    <span style="color:#aaa;font-weight:400">${c.start}–${c.end}</span>
  `;
  legendEl.appendChild(pill);
});

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
// Convert "HH:MM" → decimal hours relative to a base (default 5am)
const toH = (t, base = 0) => { const [h,m] = t.split(':').map(Number); return h + m/60 - base; };

// Compute series arrays
const dates      = days.map(d => d.date);
const minBase    = days.map(d => d.min);
const tempRange  = days.map(d => d.max - d.min);
const maxLine    = days.map(d => d.max);
const minLine    = days.map(d => d.min);
const rainData   = days.map(d => d.rain);
const humidData  = days.map(d => d.humidity);
const nightBase  = days.map(d => toH(d.sunrise));      // invisible daylight baseline
const daylightDur = days.map(d => toH(d.sunset) - toH(d.sunrise));

// ── markArea data for city zones ──
const markAreaData = cities.map(c => ([
  {
    xAxis: c.start,
    itemStyle: { color: c.color },
    label: {
      show: true,
      position: 'insideTop',
      formatter: c.label,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#888',
      offset: [0, 6],
    }
  },
  { xAxis: c.end }
]));

// ── Tooltip formatter ──
function tooltipFormatter(params) {
  const idx = params[0].dataIndex;
  const d = days[idx];
  const daylightH = toH(d.sunset) - toH(d.sunrise);
  const dH = Math.floor(daylightH);
  const dM = Math.round((daylightH - dH) * 60);

  const row = (icon, label, value, color) =>
    `<tr>
      <td style="padding:3px 10px 3px 0;color:${color};white-space:nowrap">${icon} ${label}</td>
      <td style="font-weight:700;color:${color};white-space:nowrap">${value}</td>
    </tr>`;

  return `
    <div style="padding:4px 6px 2px">
      <div style="font-weight:700;font-size:13px;margin-bottom:8px;
                  color:#374151;border-bottom:2px solid #f0f0f0;padding-bottom:6px">
        ${d.flag} ${d.city} &nbsp;·&nbsp; ${d.date}
      </div>
      <table style="font-size:12px;border-collapse:collapse">
        ${row('🌡️','Max temperature',  `${d.max} °C`,     '#d97050')}
        ${row('🌡️','Min temperature',  `${d.min} °C`,     '#667eea')}
        ${row('🌧️','Rain risk',        `${d.rain} %`,     '#5090d0')}
        ${row('💧','Humidity',          `${d.humidity} %`, '#3366aa')}
        ${row('🌅','Sunrise',           d.sunrise,         '#f59e0b')}
        ${row('🌇','Sunset',            d.sunset,          '#f97316')}
        ${row('☀️','Daylight',          `${dH}h ${dM}m`,  '#d97706')}
      </table>
    </div>`;
}

// ═══════════════════════════════════════════════════════
// ECHARTS CONFIGURATION
// ═══════════════════════════════════════════════════════
const chart = echarts.init(document.getElementById('weatherChart'), null, { renderer: 'svg' });

const option = {
  backgroundColor: 'transparent',

  textStyle: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    color: '#374151',
  },

  // ── Tooltip ──
  tooltip: {
    trigger: 'axis',
    confine: true,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: [10, 14],
    extraCssText: 'box-shadow: 0 4px 20px rgba(0,0,0,0.12); border-radius: 8px;',
    textStyle: { color: '#374151', fontSize: 12 },
    axisPointer: {
      type: 'line',
      lineStyle: { color: '#667eea', type: 'dashed', width: 1.5, opacity: 0.6 },
    },
    formatter: tooltipFormatter,
  },

  // ── Two stacked grids ──
  grid: [
    // Main chart (temperature, rain, humidity)
    { id: 'main',     top: 14, left: 54, right: 72, bottom: '33%' },
    // Daylight chart (sunrise → sunset)
    { id: 'daylight', top: '70%', left: 54, right: 72, bottom: 46 },
  ],

  // ── X axes (one per grid) ──
  xAxis: [
    {
      // Main chart x-axis (dates hidden — shared pointer from grid 1)
      gridIndex: 0,
      type: 'category',
      data: dates,
      show: false,
      axisPointer: { show: true },
    },
    {
      // Daylight chart x-axis (visible date labels)
      gridIndex: 1,
      type: 'category',
      data: dates,
      axisLine:  { lineStyle: { color: '#e0e0e0' } },
      axisTick:  { show: false },
      axisLabel: {
        rotate: 42,
        fontSize: 9,
        color: '#888',
        interval: 0,
        margin: 8,
      },
    },
  ],

  // ── Y axes ──
  yAxis: [
    {
      // Temperature (left, main)
      gridIndex: 0,
      name: '°C',
      nameTextStyle: { fontSize: 10, color: '#aaa', align: 'right', padding: [0, 4, 0, 0] },
      min: 10, max: 45,
      splitNumber: 5,
      axisLine:  { show: false },
      axisTick:  { show: false },
      axisLabel: { fontSize: 10, color: '#aaa' },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'solid' } },
    },
    {
      // Percentage (right, main) — for rain + humidity
      gridIndex: 0,
      name: '%',
      nameTextStyle: { fontSize: 10, color: '#aaa', padding: [0, 0, 0, 4] },
      min: 0, max: 100,
      position: 'right',
      splitNumber: 5,
      axisLine:  { show: false },
      axisTick:  { show: false },
      axisLabel: { fontSize: 10, color: '#aaa' },
      splitLine: { show: false },
    },
    {
      // Daylight hours — y-axis shows clock hours (5am-based offset)
      gridIndex: 1,
      name: '',
      min: 0,
      max: 23,    // 5am (0) → 8pm (15)
      splitNumber: 7,
      axisLine:  { show: false },
      axisTick:  { show: false },
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      axisLabel: {
        fontSize: 9,
        color: '#aaa',
        formatter: v => {
          const h = Math.floor(v);
          return (h < 10 ? '0' : '') + h + ':00';
        },
      },
    },
  ],

  // ── Series ──
  series: [

    // ── 1. INVISIBLE MIN BASELINE (for floating temp band via stacking) ──
    {
      name: '__minBase',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: minBase,
      stack: 'tempBand',
      symbol: 'none',
      lineStyle: { opacity: 0 },
      areaStyle: { color: 'rgba(0,0,0,0)' },
      tooltip: { show: false },
      legendHoverLink: false,
      silent: true,
      // City background zones live here
      markArea: {
        silent: true,
        label: {
          show: true,
          position: 'insideTop',
          fontSize: 10,
          fontWeight: 'bold',
          color: '#999',
          offset: [0, 6],
        },
        data: markAreaData,
      },
    },

    // ── 2. TEMPERATURE BAND (max − min on top of baseline) ──
    {
      name: 'Temp. range',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: tempRange,
      stack: 'tempBand',
      symbol: 'none',
      lineStyle: { opacity: 0 },
      areaStyle: {
        // Vertical gradient: warm red at top (hot days), cool blue at bottom (cool nights)
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0,   color: 'rgba(234, 100, 60, 0.62)' },
          { offset: 0.6, color: 'rgba(180, 130, 200, 0.40)' },
          { offset: 1,   color: 'rgba(102, 126, 234, 0.32)' },
        ]),
      },
      tooltip: { show: false },
      legendHoverLink: false,
    },

    // ── 3. MAX TEMP LINE ──
    {
      name: 'Max °C',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: maxLine,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: '#d97050', width: 2 },
      itemStyle: { color: '#d97050', borderColor: '#fff', borderWidth: 1.5 },
    },

    // ── 4. MIN TEMP LINE ──
    {
      name: 'Min °C',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: minLine,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { color: '#667eea', width: 1.5 },
      itemStyle: { color: '#667eea', borderColor: '#fff', borderWidth: 1.5 },
    },

    // ── 5. RAIN RISK BARS ──
    {
      name: 'Rain risk',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 1,
      data: rainData,
      barWidth: '55%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(70, 140, 220, 0.80)' },
          { offset: 1, color: 'rgba(70, 140, 220, 0.18)' },
        ]),
        borderRadius: [3, 3, 0, 0],
      },
      emphasis: {
        itemStyle: { color: 'rgba(70,140,220,0.95)' },
      },
    },

    // ── 6. HUMIDITY LINE ──
    {
      name: 'Humidity',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 1,
      data: humidData,
      symbol: 'none',
      lineStyle: { color: '#3366aa', type: 'dotted', width: 2.5 },
      itemStyle: { color: '#3366aa' },
    },

    // ── 7. DAYLIGHT: INVISIBLE NIGHT BASELINE (from 5am to sunrise) ──
    {
      name: '__nightBase',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 2,
      data: nightBase,
      stack: 'daylight',
      barWidth: '78%',
      itemStyle: { color: 'transparent' },
      silent: true,
      legendHoverLink: false,
      tooltip: { show: true },
    },

    // ── 8. DAYLIGHT: GOLDEN BARS (sunrise → sunset) ──
    {
      name: 'Daylight',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 2,
      data: daylightDur,
      stack: 'daylight',
      barWidth: '78%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          { offset: 0,   color: 'rgba(245, 158, 11, 0.85)' },   // sunrise amber
          { offset: 0.4, color: 'rgba(251, 191, 36, 0.90)' },   // noon gold
          { offset: 1,   color: 'rgba(251, 146, 60, 0.80)' },   // sunset orange
        ]),
        borderRadius: [3, 3, 0, 0],
      },
      emphasis: {
        itemStyle: { opacity: 1 },
      },
      tooltip: { show: false },
    },

  ],

  // ── Animation ──
  animation: true,
  animationDuration: 900,
  animationEasing: 'cubicOut',
  animationDurationUpdate: 400,
};

chart.setOption(option);

// Responsive resize
window.addEventListener('resize', () => chart.resize());
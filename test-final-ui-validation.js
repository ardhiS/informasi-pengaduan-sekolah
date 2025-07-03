// Final UI Validation Test
// Tests all UI improvements: sidebar toggle, stats toggle, filter layout, and action column positioning

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function testFileContent(filePath, testName, tests) {
  log(`\n📋 Testing ${testName}...`, colors.blue);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let passed = 0;
    let total = tests.length;

    tests.forEach((test) => {
      if (
        test.regex ? test.regex.test(content) : content.includes(test.pattern)
      ) {
        log(`  ✅ ${test.description}`, colors.green);
        passed++;
      } else {
        log(`  ❌ ${test.description}`, colors.red);
      }
    });

    log(
      `  📊 ${passed}/${total} tests passed`,
      passed === total ? colors.green : colors.yellow
    );
    return passed === total;
  } catch (error) {
    log(`  ❌ Error reading file: ${error.message}`, colors.red);
    return false;
  }
}

function runAllTests() {
  log('🚀 Starting Final UI Validation Tests...', colors.blue);

  const results = [];

  // Test 1: Sidebar Toggle Functionality
  results.push(
    testFileContent(
      'frontend/src/components/Layout/Layout.jsx',
      'Sidebar Toggle in Layout',
      [
        {
          pattern: 'isSidebarCollapsed',
          description: 'Sidebar collapse state',
        },
        {
          pattern: 'setIsSidebarCollapsed',
          description: 'Sidebar toggle setter',
        },
        {
          pattern: "localStorage.getItem('sidebarCollapsed')",
          description: 'Sidebar state persistence',
        },
        {
          pattern: "localStorage.setItem('sidebarCollapsed'",
          description: 'Sidebar state saving',
        },
      ]
    )
  );

  // Test 2: Sidebar Component
  results.push(
    testFileContent(
      'frontend/src/components/Layout/Sidebar.jsx',
      'Sidebar Component Features',
      [
        { pattern: 'isCollapsed', description: 'Collapse prop handling' },
        {
          pattern: 'transition-all duration-300',
          description: 'Smooth animations',
        },
        { pattern: 'w-16', description: 'Collapsed width' },
        { pattern: 'w-64', description: 'Expanded width' },
      ]
    )
  );

  // Test 3: Header Toggle Button
  results.push(
    testFileContent(
      'frontend/src/components/Layout/Header.jsx',
      'Header Sidebar Toggle',
      [
        { pattern: 'onToggleSidebar', description: 'Toggle function prop' },
        { pattern: 'Menu', description: 'Menu icon import' },
        {
          pattern: 'onClick={onToggleSidebar}',
          description: 'Toggle button handler',
        },
      ]
    )
  );

  // Test 4: Statistics Toggle in Complaints
  results.push(
    testFileContent(
      'frontend/src/pages/Complaints.jsx',
      'Statistics Toggle Features',
      [
        { pattern: 'showStats', description: 'Stats visibility state' },
        {
          pattern: "localStorage.getItem('complaintsStatsVisible')",
          description: 'Stats state persistence',
        },
        {
          pattern: "localStorage.setItem('complaintsStatsVisible'",
          description: 'Stats state saving',
        },
        { pattern: 'BarChart3', description: 'Stats toggle icon' },
        { pattern: 'ChevronUp', description: 'Collapse icon' },
        { pattern: 'ChevronDown', description: 'Expand icon' },
      ]
    )
  );

  // Test 5: Filter Layout (One Row)
  results.push(
    testFileContent(
      'frontend/src/pages/Complaints.jsx',
      'Filter Layout (One Row)',
      [
        {
          pattern: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
          description: 'Responsive filter grid',
        },
        { pattern: 'selectedCategory', description: 'Category filter state' },
        { pattern: 'selectedStatus', description: 'Status filter state' },
        { pattern: 'selectedPriority', description: 'Priority filter state' },
        {
          pattern: 'selectedApprovalStatus',
          description: 'Approval status filter state',
        },
      ]
    )
  );

  // Test 6: Action Column Positioning
  results.push(
    testFileContent(
      'frontend/src/pages/Complaints.jsx',
      'Action Column Positioning',
      [
        {
          regex:
            /<th[^>]*>\s*{t\('titleAndCategory'[^}]*}\s*<\/th>\s*<th[^>]*>\s*{t\('actions'[^}]*}\s*<\/th>/s,
          description: 'Actions column after Title & Category in header',
        },
        {
          regex:
            /<td[^>]*>\s*<div>\s*<div[^>]*>\s*{complaint\.title}\s*<\/div>[^<]*<div[^>]*>\s*{categoryInfo\.icon}[^<]*<\/div>\s*<\/div>\s*<\/td>\s*<td[^>]*>\s*<div className='flex justify-end space-x-1'>/s,
          description: 'Actions column after Title & Category in table body',
        },
      ]
    )
  );

  // Test 7: CSS Enhancements
  results.push(
    testFileContent('frontend/src/index.css', 'CSS Enhancements', [
      { pattern: 'sidebar-collapsed', description: 'Sidebar collapsed styles' },
      { pattern: 'stats-toggle', description: 'Stats toggle styles' },
      { pattern: 'filter-container', description: 'Filter container styles' },
      { pattern: 'transform', description: 'CSS transforms for animations' },
    ])
  );

  // Summary
  const passed = results.filter((r) => r).length;
  const total = results.length;

  log('\n📊 FINAL VALIDATION SUMMARY', colors.blue);
  log('='.repeat(50), colors.blue);

  if (passed === total) {
    log(`🎉 ALL TESTS PASSED! (${passed}/${total})`, colors.green);
    log('✅ Sidebar toggle/collapse functionality implemented', colors.green);
    log('✅ Statistics toggle functionality implemented', colors.green);
    log('✅ Filter dropdowns arranged in one responsive row', colors.green);
    log('✅ Action column moved next to Title & Category', colors.green);
    log('✅ All UI improvements completed successfully!', colors.green);
  } else {
    log(`⚠️  ${passed}/${total} test groups passed`, colors.yellow);
    log('Some features may need attention', colors.yellow);
  }

  log('\n🏁 UI validation completed!', colors.blue);
  return passed === total;
}

// Run all tests
const success = runAllTests();
process.exit(success ? 0 : 1);

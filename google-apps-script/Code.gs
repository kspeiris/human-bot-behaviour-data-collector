/**
 * Google Apps Script Web App for Behavioural Data Collection
 * Deploy as Web App with access "Anyone" for data collection
 */

// Spreadsheet configuration - script should be bound to the target spreadsheet
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('BehaviourData');
  
  if (!sheet) {
    sheet = ss.insertSheet('BehaviourData');
    // Add headers
    const headers = ['SessionID', 'EventType', 'X', 'Y', 'Value', 'PageURL', 'Timestamp'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  
  return sheet;
}

/**
 * Handle POST requests for data collection
 */
function doPost(e) {
  try {
    // Parse request data
    const requestData = JSON.parse(e.postData.contents);
    const { sessionId, eventType, x, y, value, pageUrl, timestamp } = requestData;
    
    // Validate required fields
    if (!sessionId || !eventType || !timestamp) {
      return createResponse(false, 'Missing required fields');
    }
    
    // Prepare row data
    const rowData = [
      String(sessionId),
      String(eventType),
      x !== null && x !== undefined ? Number(x) : null,
      y !== null && y !== undefined ? Number(y) : null,
      String(value || ''),
      String(pageUrl || ''),
      Number(timestamp)
    ];
    
    // Append to sheet
    const sheet = getSheet();
    sheet.appendRow(rowData);
    
    return createResponse(true, 'Event stored successfully');
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse(false, error.toString());
  }
}

/**
 * Handle GET requests for CSV export
 * Usage: GET with ?export=csv
 */
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput('No data available')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Convert to CSV
    const csvContent = data.map(row => 
      row.map(cell => {
        if (cell === null || cell === undefined) return '';
        const stringCell = String(cell);
        if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
          return `"${stringCell.replace(/"/g, '""')}"`;
        }
        return stringCell;
      }).join(',')
    ).join('\n');
    
    return ContentService.createTextOutput(csvContent)
      .setMimeType(ContentService.MimeType.CSV)
      .downloadAsFile(`behavioural_data_${new Date().toISOString().split('T')[0]}.csv`);
    
  } catch (error) {
    return ContentService.createTextOutput(`Error: ${error.toString()}`)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Helper function to create JSON response
 */
function createResponse(success, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ success, message }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Setup function to initialize the spreadsheet
 */
function setupSpreadsheet() {
  const sheet = getSheet();
  const headers = ['SessionID', 'EventType', 'X', 'Y', 'Value', 'PageURL', 'Timestamp'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  Logger.log('Spreadsheet initialized successfully');
}

/**
 * Optional: Get statistics about collected data
 */
function getStatistics() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { totalEvents: 0, uniqueSessions: 0 };
  }
  
  const events = data.slice(1);
  const sessions = new Set(events.map(row => row[0]));
  
  const eventCounts = {};
  events.forEach(row => {
    const type = row[1];
    eventCounts[type] = (eventCounts[type] || 0) + 1;
  });
  
  return {
    totalEvents: events.length,
    uniqueSessions: sessions.size,
    eventBreakdown: eventCounts,
    lastUpdated: new Date().toISOString()
  };
}
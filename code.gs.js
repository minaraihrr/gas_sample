// スプレッドシートのURLからコピーしたIDを指定する
// https://docs.google.com/spreadsheets/d/xxx/edit...
const fileId = 'xxx';
const spreadSheet = SpreadsheetApp.openById(fileId); 

const curtDate = getCurtDate();
const curtYM = curtDate.slice(0,7);
const itemTypes = ['食費', '日用品費', '医療費', '交通費', '趣味費'];

// getリクエスト時実行
function doGet() { 
  const html = HtmlService.createTemplateFromFile('index');
  html.curtDate = curtDate;
  html.curtYM = curtYM;
  html.itemTypes = itemTypes;

  return html.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 現在日付取得
function getCurtDate(){
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const curtDate = `${year}-${month}-${day}`;
  return curtDate;
}

// 月データ取得
function getMonthData(){
  const sheetMonth = spreadSheet.getSheetByName(curtYM);
  if(sheetMonth.getLastRow() <= 1){
    return [];
  }
  return sheetMonth.getRange(2,1,sheetMonth.getLastRow() -1, 4).getDisplayValues();
}

// データ追加
function addData(values){
  const sheetName = String(values[0].slice(0,7));
  const sheet = getSheet(sheetName);
  sheet.appendRow(values);
}

// シート取得
function getSheet(name){
  let sheet = spreadSheet.getSheetByName(name);
  if (!sheet){
    sheet = addSheet(name);
  }
  return sheet;
}

// シート追加
function addSheet(name){
  const headerNames = ['日付', '項目', '内容', '金額'];

  // シート追加・見出し行設定
  const sheet = spreadSheet.insertSheet(0);
  sheet.setName(name);
  sheet.appendRow(headerNames);
  sheet.getRange('A1:D1').setFontWeight('bold');

  return sheet;
}
/**
 * Cole este código em Extensões → Apps Script da sua planilha do Google Sheets.
 * Depois publique como Web App (veja o README.md na raiz do projeto para o
 * passo a passo completo). 100% gratuito, sem precisar do Google Cloud Console.
 *
 * A planilha deve ter uma aba chamada "Leads" com o cabeçalho, nesta ordem exata:
 * Data | Nome | Email | Telefone | Faturamento | Função | Link | utm_source | utm_campaign | utm_medium | utm_content
 */

var SHEET_NAME = "Leads";
var HEADER = [
  "Data",
  "Nome",
  "Email",
  "Telefone",
  "Faturamento",
  "Função",
  "Link",
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "utm_content",
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
    }

    sheet.appendRow([
      data.data || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.faturamento || "",
      data.funcao || "",
      data.link || "",
      data.utm_source || "",
      data.utm_campaign || "",
      data.utm_medium || "",
      data.utm_content || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/** Só para testar rapidamente pelo navegador se o deploy está no ar. */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "Web App do diagnóstico está no ar." })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current document.
 */

var DIALOG_TITLE = 'Example Dialog';
var SIDEBAR_TITLE = 'Example Sidebar';

/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  DocumentApp.getUi()
      .createAddonMenu()
      .addItem('Show sidebar', 'showSidebar')
      .addItem('Show dialog', 'showDialog')
      .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */
function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle(SIDEBAR_TITLE)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Opens a dialog. The dialog structure is described in the Dialog.html
 * project file.
 */
function showDialog() {
  var ui = HtmlService.createTemplateFromFile('Dialog')
      .evaluate()
      .setWidth(400)
      .setHeight(150)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  DocumentApp.getUi().showModalDialog(ui, DIALOG_TITLE);
}

/**
 * Returns the existing footer text (if any).
 *
 * @return {String} existing document footer text (as a plain string).
 */
function getFooterText() {
  // Retrieve and return the information requested by the sidebar.
  var footer = DocumentApp.getActiveDocument().getFooter();
  if (footer == null) {
    return '';
  }
  return footer.getText();
}

/**
 * Replaces the current document footer with the given text.
 *
 * @param {String} footerText text collected from the client-side
 *     sidebar.
 */
function setFooterText(footerText) {
  // Use data collected from sidebar to manipulate the document.
  var footer = DocumentApp.getActiveDocument().getFooter();
  if (footer == null) {
    footer = DocumentApp.getActiveDocument().addFooter();
  }
  footer.setText(footerText);
}

/**
 * Returns the document title.
 *
 * @return {String} the current document title.
 */
function getDocTitle() {
  // Retrieve and return the information requested by the dialog.
  return DocumentApp.getActiveDocument().getName();
}

/**
 * Changes the document title.
 *
 * @param {String} title the new title to use for the document.
 */
function setDocTitle(title) {
  // Use data collected from dialog to manipulate the document.
  DocumentApp.getActiveDocument().setName(title);
}

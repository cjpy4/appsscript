var glyph = DocumentApp.GlyphType.BULLET;

function addItemToDoc(item = "This is a test", user = "Bob Ross") {
  let today = new Date
  const dateOptions = { dateStyle: "short", timeStyle: "short", timeZone: "America/Chicago" }
  const timestampString = today.toLocaleString("en-US", dateOptions) // → "12/11/2012, 7:00:00 PM"
  
  const doc = DocumentApp.openById("1x3q1u84CUU-g2GskQ-rAmEZTSzHyufnNTtOg4pzd8pU")
  const body = doc.getBody()
  // const paragraphs = body.getParagraphs().map(p => p.getText())
  // const matchText = body.findText("Floating Items")
  body.insertListItem(2,`${item} - ${user} - ${timestampString}`).setGlyphType(glyph);
  const attr = body.getAttributes()
  return doc.getUrl()

}

function getSuggestedAgendaItems() {
  // let today = new Date
  // const dayOfWeek = today.getDay()
  // const dateOptions = { dateStyle: "short", timeZone: "America/Chicago" }
  // const todayString = today.toLocaleDateString("en-US", dateOptions) // → "12/19/12"
  // const weekStartDate = new Date
  // weekStartDate.setDate(today.getDate() - dayOfWeek + 1)
  // const weekStart = weekStartDate.toLocaleDateString("en-US", dateOptions)

  const doc = DocumentApp.openById("1x3q1u84CUU-g2GskQ-rAmEZTSzHyufnNTtOg4pzd8pU")
  const body = doc.getBody()
  const listItems = body.getListItems().map((l) => new Object({"id":l.getListId(), "text":l.getText()}))
  const lists = [...new Set(listItems.map((l) => l.id))]
  const suggestedAgenda = listItems.filter(l => l.id === lists[0] & l.text != "")
  const currentAgenda = listItems.filter(l => l.id === lists[3] & l.text != "")

  return [...currentAgenda,...suggestedAgenda]
}

// Adds a new Agenda block for the upcoming weekly meeting. 
function addNextWeekAgenda() {
  const doc = DocumentApp.openById("1x3q1u84CUU-g2GskQ-rAmEZTSzHyufnNTtOg4pzd8pU")
  const body = doc.getBody();
  const dateOptions = { dateStyle: "short", timeZone: "America/Chicago" }

  let today = new Date;
  let day = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  let nextMeeting = new Date(year,month, day + 7);
  
  let dateStyle = {}
  dateStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#1fb4cd';
  dateStyle[DocumentApp.Attribute.BOLD] = true;
  dateStyle[DocumentApp.Attribute.FONT_SIZE] = '16';

  let headingStyle = {}
  headingStyle[DocumentApp.Attribute.BOLD] = true
  headingStyle[DocumentApp.Attribute.FONT_SIZE] = '14';


  let jerries = ['Stefan', 'Landan', 'Jsutin', 'Clark', 'CJ', 'Camron', 'Asutin', 'DeAnna', 'Ben', 'Kendall', 'Will', 'Sam', 'Alyssa', 'Ashlie', 'David', 'Matt'];

  function shuffle(array) {
  var currentIndex = array.length,  randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

let firstHR = body.findElement(DocumentApp.ElementType.HORIZONTAL_RULE);
let paragraph = firstHR.getElement().getParent();
let docBody = paragraph.getParent();
let nextAgendaIndex = docBody.getChildIndex(paragraph) + 1;

  body.insertHorizontalRule(nextAgendaIndex);
  body.insertListItem(nextAgendaIndex, 'Agenda Item').setGlyphType(glyph).setSpacingAfter(20);
  body.insertParagraph(nextAgendaIndex, 'Agenda Items').setAttributes(headingStyle).setSpacingBefore(20).setSpacingAfter(5);
  shuffle(jerries).forEach(jerry => body.insertListItem(nextAgendaIndex, jerry).setGlyphType(glyph));
  body.insertParagraph(nextAgendaIndex,'Personal/Professional Positives').setAttributes(headingStyle).setSpacingBefore(20).setSpacingAfter(5);
  body.insertListItem(nextAgendaIndex, 'Prayer Notes').setGlyphType(glyph);
  body.insertParagraph(nextAgendaIndex,'Prayer').setAttributes(headingStyle).setSpacingBefore(20).setSpacingAfter(5);
  body.insertParagraph(nextAgendaIndex, nextMeeting.toLocaleDateString("en-US", dateOptions)).setAttributes(dateStyle).setSpacingBefore(20);
}

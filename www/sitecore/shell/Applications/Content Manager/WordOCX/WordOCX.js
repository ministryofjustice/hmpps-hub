function WordOCX_Initialize(wordObject) {

  // Disabling "Save" button
  wordObject.EnableFileCommand(3) = false; // "Save"
  wordObject.EnableFileCommand(4) = false; // "Save As"
}

function WordOCX_InsertLink(word, link, defaultText) {
  word.Activate();
  var doc = word.ActiveDocument;
  var range = doc.Application.Selection.Range;
  if (!range.Text){
    range.Text = defaultText;
  }
  else{
    var selectedHyperlinks = range.Hyperlinks;
    if (selectedHyperlinks) {
      while(selectedHyperlinks.Count > 0){
        selectedHyperlinks.Item(1).Delete();
      }
    }
  }
  doc.Hyperlinks.Add(range, link, '');
}

function WordOCX_InsertPicture(word, imagePath, alt) {
  var image;
  try {
    word.Activate();
    image = word.ActiveDocument.Application.Selection.InlineShapes.AddPicture(imagePath); //, false /* LinkToFile */, true /*SaveWithDocument*/);
  }
  catch(err) {
    if(err.description.indexOf('This is not a valid file name') > 0) {
       alert('Failed to insert media. \n. Possible reason: Item has not been published.');
    }
    throw err;
  }
  if(alt != null && alt != '') {
    image.AlternativeText = alt;
  }
  return image;
}

function WordOCX_UploadDocument(word, uploadLink, restoreDocument) {
  word.Activate();
  var tempFilePath1 = word.GetTempFilePath();    
  var tempFilePath2 = word.GetTempFilePath();    
  word.ActiveDocument.WebOptions.AllowPNG = true;
  
  word.ActiveDocument.SaveAs(tempFilePath1, 16 /* wdFormatDocumentDefault */, false, '', false, '', false, false, false, false, false);
  word.ActiveDocument.SaveAs(tempFilePath2, 10 /* wdFormatFilteredHTML */, false, '', false, '', false, false, false, false, false);      
  WordOCX_RestoreViewType(word);
  word.Close(); // We cannot upload an opened document
  
  word.HttpInit();
  word.HttpAddPostFile(tempFilePath1, "file.docx");
  word.HttpAddPostFile(tempFilePath2, "file.mhtml"); // we use 'mhtml' extension, since posting with 'html' extension did not work
  word.HttpAddPostRelatedFiles(tempFilePath2); // Adding image files to post data
  
  word.HttpPost(uploadLink);
}

function WordOCX_ToggleToolbar(word){
  word.Activate();
  word.Toolbars = !word.Toolbars;
}

 function WordOCX_RestoreViewType(word){
    if(!word.currentView){
      return;
    }
    if (!word.IsOpened) {
        wordObject.CreateNew("Word.Document");
    }
    word.ActiveDocument.ActiveWindow.View.Type = word.currentView;
  }

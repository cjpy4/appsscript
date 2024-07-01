// Generic function to MOVE large amounts of files between Google Drive folders. Simply pass in the relevant folder IDs whenever you call the function. 

function moveFiles(destinationFolderId = '1hxX1l4D7dodAmwzycgsP3WCpfqt3SuWE',  sourceFolderId = '1sqvfGv9JlRoq_VGpYUSRv-ZoDU4YedD0') {

  const sourceFolder = DriveApp.getFolderById(sourceFolderId);
  const destinationFolder = DriveApp.getFolderById(destinationFolderId);
  let fileData = sourceFolder.getFiles();
  let files = [];

  while (fileData.hasNext()) {
    let file = fileData.next();
    file.moveTo(destinationFolder);
    files.push(file);
  }
  if(files.length == 0) {
  console.log('Found '+files.length+' files. Nothing to Move!');
  } else {
      console.log('Found '+files.length+' files. All have been moved to destination folder. Have a nice day!');
    }
}

// Generic function to COPY large amounts of files between Google Drive folders. Simply pass in the relevant folder IDs whenever you call the function. This function will set the file name to be identical to the original file. To change this, update the first argument of the makeCopy function on line 33.

function copyFiles(sourceFolderId = '1hxX1l4D7dodAmwzycgsP3WCpfqt3SuWE',  destinationFolderId = '1sqvfGv9JlRoq_VGpYUSRv-ZoDU4YedD0') {

  const sourceFolder = DriveApp.getFolderById(sourceFolderId);
  const destinationFolder = DriveApp.getFolderById(destinationFolderId);
  let fileData = sourceFolder.getFiles();
  let files = [];

 while (fileData.hasNext()) {
    let file = fileData.next();
    file.makeCopy(file.getName(), destinationFolder);
    files.push(file);
  }
if(files.length == 0) {
  console.log('Found '+files.length+' files. Nothing to Copy!');
  } else {
      console.log('Found '+files.length+' files. All have been Copied to destination folder. Have a nice day!');
    }
}
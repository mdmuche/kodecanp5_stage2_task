const fs = require("fs").promises;
const path = require("path");

// task1: Read and Display file contents
async function readFileAsync(filename) {
  try {
    const data = await fs.readFile(filename, "utf-8");
    console.log(`\n--- Contents of ${filename} --\n${data}`);
  } catch (err) {
    console.error(`Error reading file "${filename}":`, err.message);
  }
}

//Sample Output:
// async function readMain() {
//   await readFileAsync("sample.txt");
// }

// readMain();
// --- Contents of sample.txt --
// hello world!

// task2: write content to file
async function writeFileAsync(filename, content) {
  try {
    await fs.writeFile(filename, content);
    console.log(`successfully written to ${filename}`);
  } catch (err) {
    console.error(`Error writing to file "${filename}":`, err.message);
  }
}

// sample output
// async function writeMain() {
//   await writeFileAsync("output.txt", "This is my task submission");
// }

// writeMain();
// successfully written to output.txt

// task 3: copy file from source to destination
async function copyFileAsync(source, destination) {
  try {
    await fs.access(source);
    const destDir = path.dirname(destination);
    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(source, destination);
    console.log(`copied ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying file from "${source}" to "${destination}"`);
  }
}

// sample output
// async function copyFileMain() {
//   await copyFileAsync("output.txt", "backup/sample_backup.txt");
// }

// copyFileMain();
// copied output.txt to backup/sample_backup.txt

// task 4: Append Content to Existing File
async function appendFileAsync(filename, content) {
  try {
    let before = "";
    try {
      before = await fs.readFile(filename, "utf-8");
    } catch {
      console.log(`${filename} doesn't exist. it will be created.`);
    }

    console.log(`\n--- Before Append ---\n${before}`);
    await fs.appendFile(filename, content);
    const after = await fs.readFile(filename, "utf-8");
    console.log(`\n--- After Append ---\n${after}`);
  } catch (err) {
    console.error(`Error appending to file "${filename}":`, err.message);
  }
}

// sample output
// async function appendFileMain() {
//   await appendFileAsync("output.txt", "\nAppended line 1\nAppended line 2");
// }

// appendFileMain();
// --- Before Append ---
// i am writing into this file

// --- After Append ---
// i am writing into this file
// Appended line 1
// Appended line 2

// task 5: list directory contents
async function listDirectoryAsync(dirPath) {
  try {
    const items = await fs.readdir(dirPath);
    const details = await Promise.all(
      items.map(async (item) => {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        return {
          name: item,
          type: stat.isDirectory() ? "Directory" : "File",
          size: stat.size,
        };
      })
    );

    console.log(`\n--- Contents of ${dirPath} ---`);
    details
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((item) => {
        console.log(`${item.name} - ${item.type} - ${item.size} bytes`);
      });
  } catch (err) {
    console.error(`Error listing directory "${dirPath}":`, err.message);
  }
}

// sample output
// async function listDirectoryMain() {
//   await listDirectoryAsync(".");
// }

// listDirectoryMain();
// --- Contents of . ---
// backup - Directory - 0 bytes
// filesystem-operations.js - File - 3505 bytes
// output.txt - File - 59 bytes
// package.json - File - 243 bytes
// sample.txt - File - 12 bytes
// test-files - Directory - 0 bytes

// task 6: create and delete operation

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
async function createDirectoryAsync(dirPath) {
  try {
    if (await exists(dirPath)) {
      console.log(`Directory "${dirPath} already exist"`);
    } else {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`directory "${dirPath} created`);
    }
  } catch (err) {
    console.error(`Error creating directory "${dirPath}":`, err.message);
  }
}

async function createFileAsync(filename, content) {
  try {
    if (await exists(filename)) {
      console.log(`File "${filename} already exist"`);
    } else {
      await fs.writeFile(filename, content);
      console.log(`file "${filename}" created`);
    }
  } catch (err) {
    console.error(`Error creating file "${filename}":`, err.message);
  }
}

async function deleteFileAsync(filename) {
  try {
    if (await exists(filename)) {
      await fs.unlink(filename);
      console.log(`file "${filename}" deleted`);
    } else {
      console.log(`file "${filename} doesn't exist"`);
    }
  } catch (err) {
    console.error(`Error deleting file "${filename}":`, err.message);
  }
}

async function deleteDirectoryAsync(dirPath) {
  try {
    if (await exists(dirPath)) {
      await fs.rmdir(dirPath);
      console.log(`Directory "${dirPath} deleted"`);
    } else {
      console.log(`Directory "${dirPath} doesn't exist"`);
    }
  } catch (err) {
    console.error(`Error deleting directory "${dirPath}":`, err.message);
  }
}

// sample output:
async function createAndDeleteMain() {
  await createDirectoryAsync("temp");
  //   directory "temp created

  await createFileAsync("temp/text.txt", "temporary file");
  // file "temp/text.txt" created

  await deleteFileAsync("temp/text.txt");
  // file "#temp/text.txt deleted

  await deleteDirectoryAsync("temp");
  // Directory "temp deleted"
}

// createAndDeleteMain();

// --- to run and test all tasks together ---
async function runAllTasks() {
  await readFileAsync("sample.txt");
  await writeFileAsync("output.txt", "This is my task submission");
  await copyFileAsync("output.txt", "backup/sample_backup.txt");
  await appendFileAsync("output.txt", "\nAppended line 1\nAppended line 2");
  await listDirectoryAsync(".");
  await listDirectoryAsync("test-files");
  await createDirectoryAsync("temp");
  await createFileAsync("temp/text.txt", "temporary file");
  await deleteFileAsync("temp/text.txt");
  await deleteDirectoryAsync("temp");
}

async function runAllTasksToCheckErrors() {
  await readFileAsync("sample.txt");
  await writeFileAsync("output.txt", "This is my task submission");
  await copyFileAsync("output.txt", "backup/sample_backup.txt");
  await appendFileAsync("output.txt", "\nAppended line 1\nAppended line 2");
  await listDirectoryAsync(".");
  await listDirectoryAsync("test-files");

  await createDirectoryAsync("temp");
  await createDirectoryAsync("temp");

  await createFileAsync("temp/text.txt", "temporary file");
  await createFileAsync("temp/text.txt", "temporary file");

  await deleteFileAsync("temp/text.txt");
  await deleteFileAsync("temp/text.txt");

  await deleteDirectoryAsync("temp");
  await deleteDirectoryAsync("temp");
}

// uncomment to run everything
// runAllTasks();
// runAllTasksToCheckErrors();

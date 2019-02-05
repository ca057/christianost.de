require('dotenv').config();

const { writeToFile } = require('./lib/files');
const { loadTrackedTime } = require('./tasks/loadTrackedTime');

const DATA_FILE_PATH = process.env.data_file_path;

const loadTrackedTimeForWorkspace = () =>
  loadTrackedTime({
    workspaceId: process.env.toggl_workspace_id,
  });

async function main() {
  const [trackedTime] = await Promise.all([loadTrackedTimeForWorkspace()]);

  await writeToFile(DATA_FILE_PATH, JSON.stringify(trackedTime), {});
}

main();

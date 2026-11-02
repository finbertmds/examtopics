import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'skills');
const publicRelease = process.argv.includes('--public');
if (process.argv.slice(2).some(argument => argument !== '--public')) {
  throw new Error('Chỉ hỗ trợ tùy chọn --public.');
}
const metadataSource = publicRelease ? path.join(source, 'public-release') : source;
const output = path.join(root, 'plugins', publicRelease ? 'examtopics-public' : 'examtopics');
const archive = path.join(root, 'dist', publicRelease ? 'examtopics-public-draft.zip' : 'examtopics-plugin.zip');
const skillName = 'examtopics-explainer';

function checkSource(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.DS_Store' || entry.name === '.git') continue;
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink không được đóng gói: ${filename}`);
    if (entry.isDirectory()) checkSource(filename);
    else if (!entry.isFile()) throw new Error(`Loại file không hỗ trợ: ${filename}`);
  }
}

let temporary;
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(metadataSource, 'plugin.json'), 'utf8'));
  if (manifest.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'
      || manifest.name !== 'examtopics'
      || !/^\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?(?:\+[\da-zA-Z.-]+)?$/.test(manifest.version)) {
    throw new Error('Manifest cần đúng schema, name examtopics và version SemVer.');
  }
  const skillSource = path.join(source, skillName);
  const instructions = fs.readFileSync(path.join(skillSource, 'SKILL.md'), 'utf8');
  if (!instructions.startsWith('---\n') || !instructions.includes(`name: ${skillName}\n`)) {
    throw new Error('SKILL.md thiếu frontmatter hoặc name không khớp.');
  }
  checkSource(skillSource);
  fs.accessSync(path.join(source, 'LICENSE'));
  if (publicRelease) {
    const listing = manifest.extensions['com.openai'].interface;
    for (const [key, limit] of Object.entries({ displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80 })) {
      if (typeof listing[key] !== 'string' || !listing[key].trim() || [...listing[key]].length > limit) {
        throw new Error(`Listing ${key} không hợp lệ (tối đa ${limit} ký tự).`);
      }
    }
    checkSource(path.join(metadataSource, 'assets'));
    for (const key of ['logo', 'composerIcon', 'logoDark', 'composerIconDark']) {
      if (!/^\.\/assets\/[a-zA-Z0-9-]+\.png$/.test(listing[key])) throw new Error(`Đường dẫn ${key} không hợp lệ.`);
      fs.accessSync(path.join(metadataSource, listing[key]));
    }
  }
  execFileSync('zip', ['-v'], { stdio: 'ignore' });
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'examtopics-package-'));
  const staged = path.join(temporary, 'examtopics');
  fs.mkdirSync(path.join(staged, 'skills'), { recursive: true });
  fs.cpSync(skillSource, path.join(staged, 'skills', skillName), {
    recursive: true,
    filter: filename => !['.DS_Store', '.git'].includes(path.basename(filename))
  });
  fs.copyFileSync(path.join(metadataSource, 'plugin.json'), path.join(staged, 'plugin.json'));
  fs.copyFileSync(path.join(source, 'LICENSE'), path.join(staged, 'LICENSE'));
  if (publicRelease) fs.cpSync(path.join(metadataSource, 'assets'), path.join(staged, 'assets'), { recursive: true });
  const temporaryArchive = path.join(temporary, 'examtopics-plugin.zip');
  execFileSync('zip', ['-q', '-r', temporaryArchive, 'examtopics'], { cwd: temporary });
  // Build successfully before replacing generated output. Recreating it removes stale files.
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.rmSync(output, { recursive: true, force: true });
  fs.cpSync(staged, output, { recursive: true });
  fs.mkdirSync(path.dirname(archive), { recursive: true });
  fs.copyFileSync(temporaryArchive, archive);
  console.log(`Đã đồng bộ: ${output}`);
  console.log(`Đã đóng gói v${manifest.version}: ${archive}`);
  if (publicRelease) console.log('Gói public draft: xem skills/public-release/README.md về thông tin và xác minh còn thiếu.');
} catch (error) {
  console.error(`Đóng gói thất bại: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
}

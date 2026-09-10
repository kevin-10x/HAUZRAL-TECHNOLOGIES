import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('project metadata is present', () => {
  assert.equal(pkg.name, 'hauzral-technologies');
  assert.equal(pkg.private, true);
});

test('portfolio project list includes public live links', () => {
  const source = fs.readFileSync(new URL('../src/components/ProjectsSection.jsx', import.meta.url), 'utf8');
  assert.match(source, /https:\/\/hauzral-technologies\.vercel\.app\//);
  assert.match(source, /https:\/\/github\.com\/kevin-10x\/HAUZRAL-TECHNOLOGIES/);
  assert.match(source, /https:\/\/logistics-web-alpha\.vercel\.app\//);
});

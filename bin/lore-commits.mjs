#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, rmSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SKILL_NAME = "lore-commits";
const SOURCE = join(__dirname, "..", "skills", SKILL_NAME, "SKILL.md");
const TARGET_DIR = join(homedir(), ".claude", "skills", SKILL_NAME);
const TARGET = join(TARGET_DIR, "SKILL.md");

const args = process.argv.slice(2);
const command = args[0];

function install() {
  mkdirSync(TARGET_DIR, { recursive: true });
  copyFileSync(SOURCE, TARGET);
  console.log(`Installed lore-commits skill to ${TARGET_DIR}`);
  console.log();
  console.log("Claude Code will now use Lore format for commit messages.");
  console.log("Trailers: Constraint, Rejected, Confidence, Scope-risk,");
  console.log("          Reversibility, Directive, Tested, Not-tested, Related");
}

function uninstall() {
  if (!existsSync(TARGET)) {
    console.log("lore-commits skill is not installed.");
    return;
  }
  rmSync(TARGET_DIR, { recursive: true });
  console.log(`Removed lore-commits skill from ${TARGET_DIR}`);
}

function showHelp() {
  console.log(`
lore-commits — Structured knowledge protocol for git commits

Usage:
  npx lore-commits            Install the Claude Code skill
  npx lore-commits uninstall  Remove the skill
  npx lore-commits help       Show this help

What it does:
  Installs a Claude Code skill that writes commit messages with
  git trailers capturing decision context — constraints, rejected
  alternatives, confidence, directives, and test coverage gaps.

  Your git history becomes a queryable decision database:
    git log --trailer="Rejected" -- path/to/file.ts

Paper: https://arxiv.org/abs/2603.15566
Repo:  https://github.com/tmdgusya/lora
`);
}

switch (command) {
  case "uninstall":
  case "remove":
    uninstall();
    break;
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  default:
    install();
    break;
}

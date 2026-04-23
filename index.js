#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { scaffoldProject } from './scaffolder.js';

const program = new Command();

program
  .version('1.0.0')
  .description('MERN Boilerplate CLI');

program
  .command('create')
  .description('Create a new MERN project')
  .action(async () => {
    console.log(chalk.cyanBright('Welcome to the MERN Boilerplate CLI! 🚀\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-mern-app',
      },
      {
        type: 'confirm',
        name: 'includeRedis',
        message: 'Do you want to include Redis for caching?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeOpenAI',
        message: 'Enable OpenAI integration?',
        default: false,
      }
    ]);

    await scaffoldProject(answers);
  });

// If no args provided, default to 'create' command
if (!process.argv.slice(2).length) {
  process.argv.push('create');
}

program.parse(process.argv);

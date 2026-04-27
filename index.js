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
  .argument('[projectName]', 'Name of the project folder')
  .option('--redis', 'Include Redis for caching')
  .option('--no-redis', 'Exclude Redis from backend')
  .option('--openai', 'Enable OpenAI integration')
  .option('--no-openai', 'Disable OpenAI integration')
  .option('-y, --yes', 'Skip prompts and use CLI/default values')
  .description('Create a new MERN project')
  .action(async (projectNameArg, options) => {
    console.log(chalk.cyanBright('Welcome to the MERN Boilerplate CLI! 🚀\n'));

    const hasRedisFlag = options.redis !== undefined;
    const hasOpenAiFlag = options.openai !== undefined;

    if (options.yes) {
      await scaffoldProject({
        projectName: projectNameArg || 'my-mern-app',
        includeRedis: hasRedisFlag ? options.redis : true,
        includeOpenAI: hasOpenAiFlag ? options.openai : false,
      });
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: projectNameArg || 'my-mern-app',
      },
      {
        type: 'confirm',
        name: 'includeRedis',
        message: 'Do you want to include Redis for caching?',
        default: hasRedisFlag ? options.redis : true,
      },
      {
        type: 'confirm',
        name: 'includeOpenAI',
        message: 'Enable OpenAI integration?',
        default: hasOpenAiFlag ? options.openai : false,
      }
    ]);

    await scaffoldProject(answers);
  });

// If no args provided, default to 'create' command
if (!process.argv.slice(2).length) {
  process.argv.push('create');
}

program.parse(process.argv);

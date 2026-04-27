import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const scaffoldProject = async (answers) => {
  const { projectName, includeRedis, includeOpenAI } = answers;
  
  const sourceDir = __dirname; 
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`\nDirectory "${projectName}" already exists!`));
    process.exit(1);
  }

  console.log(chalk.blue(`\nScaffolding project in ${targetDir}...`));

  try {
    // 1. Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // 2. Copy backend and frontend 
    const dirsToCopy = ['backend', 'frontend'];
    
    for (const dir of dirsToCopy) {
      if (fs.existsSync(path.join(sourceDir, dir))) {
        await fs.copy(path.join(sourceDir, dir), path.join(targetDir, dir), {
          filter: (src) => {
            // Do not copy node_modules inside template
            return !src.includes('node_modules');
          }
        });
      }
    }

    // 3. Copy .env.example
    if (fs.existsSync(path.join(sourceDir, '.env.example'))) {
      await fs.copy(path.join(sourceDir, '.env.example'), path.join(targetDir, '.env.example'));
    }

    // 4. Handle Redis Logic
    if (!includeRedis) {
      const redisPath = path.join(targetDir, 'backend', 'config', 'redis.js');
      if (fs.existsSync(redisPath)) {
        fs.removeSync(redisPath);
      }
      
      const serverPath = path.join(targetDir, 'backend', 'server.js');
      if (fs.existsSync(serverPath)) {
        let serverCode = fs.readFileSync(serverPath, 'utf8');
        // Remove redis connection logic
        serverCode = serverCode.replace(/import\s*\{\s*connectRedis\s*\}\s*from\s*["']\.\/config\/redis\.js["'];?\s*/g, '');
        serverCode = serverCode.replace(/if\s*\(process\.env\.REDIS_URL\)\s*connectRedis\(\);\s*/g, '');
        fs.writeFileSync(serverPath, serverCode);
      }
      
      const pkgPath = path.join(targetDir, 'backend', 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.dependencies && pkg.dependencies.redis) {
          delete pkg.dependencies.redis;
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        }
      }
    }

    // 5. Handle OpenAI Logic
    if (!includeOpenAI) {
      const openAiPath = path.join(targetDir, 'backend', 'utils', 'openAi.js');
      if (fs.existsSync(openAiPath)) {
        fs.removeSync(openAiPath);
      }
    }

    console.log(chalk.green(`\n✅ Success! Your project "${projectName}" is ready.`));
    console.log(chalk.cyan(`\nNext steps:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  cd backend && npm install`));
    console.log(chalk.white(`  cd ../frontend && npm install`));

  } catch (error) {
    console.error(chalk.red(`\n❌ Error scaffolding project: ${error.message}`));
  }
};

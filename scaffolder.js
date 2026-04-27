import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync, spawnSync } from 'child_process';
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
        }
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      }
    }

    // 5. Handle OpenAI Logic
    if (!includeOpenAI) {
      const openAiPath = path.join(targetDir, 'backend', 'utils', 'openAi.js');
      if (fs.existsSync(openAiPath)) {
        fs.removeSync(openAiPath);
      }

      const aiControllerPath = path.join(targetDir, 'backend', 'controllers', 'aiController.js');
      if (fs.existsSync(aiControllerPath)) {
        fs.removeSync(aiControllerPath);
      }

      const aiRoutesPath = path.join(targetDir, 'backend', 'routes', 'aiRoutes.js');
      if (fs.existsSync(aiRoutesPath)) {
        fs.removeSync(aiRoutesPath);
      }

      const serverPath = path.join(targetDir, 'backend', 'server.js');
      if (fs.existsSync(serverPath)) {
        let serverCode = fs.readFileSync(serverPath, 'utf8');
        serverCode = serverCode.replace(/import\s+aiRoutes\s+from\s+["']\.\/routes\/aiRoutes\.js["'];?\s*/g, '');
        serverCode = serverCode.replace(/app\.use\(["']\/api\/ai["'],\s*aiRoutes\);\s*/g, '');
        fs.writeFileSync(serverPath, serverCode);
      }
    }

    // 6. Dynamically shape backend package dependencies
    const backendPkgPath = path.join(targetDir, 'backend', 'package.json');
    if (fs.existsSync(backendPkgPath)) {
      const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
      backendPkg.dependencies = backendPkg.dependencies || {};
      if (includeOpenAI) {
        backendPkg.dependencies.openai = backendPkg.dependencies.openai || '^4.77.0';
      } else {
        delete backendPkg.dependencies.openai;
      }
      if (!includeRedis) {
        delete backendPkg.dependencies.redis;
      }
      fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2));
    }

    // 7. Automated setup: install dependencies and initialize git
    const dirsWithPackageJson = [targetDir, path.join(targetDir, 'backend'), path.join(targetDir, 'frontend')]
      .filter((dir) => fs.existsSync(path.join(dir, 'package.json')));

    for (const dir of dirsWithPackageJson) {
      execSync('npm install', { cwd: dir, stdio: 'inherit' });
    }

    if (!fs.existsSync(path.join(targetDir, '.git'))) {
      execSync('git init', { cwd: targetDir, stdio: 'inherit' });
    }

    const mongoCheck = spawnSync('mongod', ['--version'], { stdio: 'ignore', shell: true });
    if (mongoCheck.status !== 0) {
      console.log(chalk.yellow('\n⚠️ MongoDB server was not detected on this machine.'));
      console.log(chalk.yellow('   Install MongoDB Community Server or update MONGO_URI to a hosted database.'));
    }

    console.log(chalk.green(`\n✅ Success! Your project "${projectName}" is ready.`));
    console.log(chalk.cyan(`\nNext steps:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  npm run dev (inside backend)`));

  } catch (error) {
    console.error(chalk.red(`\n❌ Error scaffolding project: ${error.message}`));
  }
};

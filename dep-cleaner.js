#!/usr/bin/env node

/**
 * Dependency Cleaner
 * 
 * This script scans all JavaScript files in a project and checks if each dependency
 * in package.json is actually being used. It helps identify dependencies that might
 * be safely removed to reduce the node_modules size.
 * 
 * Usage: node dep-cleaner.js [service-directory]
 * If no directory is specified, it will check all services.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Service directories to check
const services = ['user-service', 'product-service', 'order-service', 'payment-service', 'frontend'];

// Get the target service from command line arguments
const targetService = process.argv[2];

// Check if the specified directory exists
if (targetService && !services.includes(targetService)) {
  console.error(`Service "${targetService}" not found. Available services: ${services.join(', ')}`);
  process.exit(1);
}

// List of services to check
const servicesToCheck = targetService ? [targetService] : services;

// Function to recursively get all JS files in a directory
async function getAllJsFiles(directory) {
  const files = [];
  
  async function scan(dir) {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') continue;
      
      const fullPath = path.join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        await scan(fullPath);
      } else if (stats.isFile() && (
        entry.endsWith('.js') || 
        entry.endsWith('.jsx') || 
        entry.endsWith('.ts') || 
        entry.endsWith('.tsx')
      )) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(directory);
  return files;
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Dependency Cleaner - Find Potentially Unused Dependencies');
  console.log('='.repeat(60));
  console.log();
  
  for (const service of servicesToCheck) {
    console.log(`Analyzing ${service}...`);
    
    // Check if package.json exists
    const packageJsonPath = path.join(service, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log(`  No package.json found in ${service}, skipping.`);
      console.log();
      continue;
    }
    
    // Load package.json
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
    const dependencies = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    if (Object.keys(dependencies).length === 0) {
      console.log(`  No dependencies found in ${service}, skipping.`);
      console.log();
      continue;
    }
    
    // Get all JS files
    const jsFiles = await getAllJsFiles(service);
    
    console.log(`  Found ${jsFiles.length} JavaScript/TypeScript files.`);
    console.log(`  Checking ${Object.keys(dependencies).length} dependencies...`);
    
    // Check usage of each dependency
    const unusedDependencies = [];
    const usedDependencies = [];
    
    for (const dep of Object.keys(dependencies)) {
      // Skip dependencies that start with @ as they're often part of a package group
      if (dep.startsWith('@')) {
        usedDependencies.push({ name: dep, reason: 'Scoped package (assumed used)' });
        continue;
      }
      
      // Always keep certain critical dependencies
      const criticalDeps = ['react', 'react-dom', 'express', 'typescript', 'webpack', 'babel', 'jest', 'mocha'];
      if (criticalDeps.some(critDep => dep.includes(critDep))) {
        usedDependencies.push({ name: dep, reason: 'Core dependency (assumed used)' });
        continue;
      }
      
      // Check if dependency is used in any file
      let isUsed = false;
      for (const file of jsFiles) {
        const content = await readFile(file, 'utf8');
        
        // Check for import statements and require calls
        if (
          content.includes(`import`) && (
            content.includes(`'${dep}'`) || 
            content.includes(`"${dep}"`) ||
            content.includes(`from '${dep}/`) || 
            content.includes(`from "${dep}/`)
          )
        ) {
          isUsed = true;
          break;
        }
        
        if (
          content.includes(`require`) && (
            content.includes(`'${dep}'`) || 
            content.includes(`"${dep}"`) ||
            content.includes(`'${dep}/`) || 
            content.includes(`"${dep}/`)
          )
        ) {
          isUsed = true;
          break;
        }
      }
      
      if (!isUsed) {
        unusedDependencies.push(dep);
      } else {
        usedDependencies.push({ name: dep, reason: 'Found usage in code' });
      }
    }
    
    // Output results
    console.log();
    if (unusedDependencies.length > 0) {
      console.log(`  Potentially unused dependencies in ${service}:`);
      unusedDependencies.forEach(dep => {
        console.log(`  - ${dep} (${dependencies[dep]})`);
      });
    } else {
      console.log(`  No unused dependencies found in ${service}!`);
    }
    
    console.log();
    console.log(`  To remove unused dependencies, you can run:`);
    if (unusedDependencies.length > 0) {
      console.log(`  cd ${service} && npm uninstall ${unusedDependencies.join(' ')}`);
    }
    console.log();
    console.log('-'.repeat(60));
  }
  
  console.log();
  console.log('Analysis complete!');
  console.log('Note: This tool provides suggestions only. Please verify before removing any dependency.');
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 
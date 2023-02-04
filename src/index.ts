#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import inquirer from 'inquirer'

let command = process.argv[2];
if(command === 'add'){
    const questions = await inquirer.prompt([
        {
            message: 'What should be the todo title?',
            type: 'input',
            name: 'title'
        },
    ]);
    
    if(!existsSync('todos.json')){
        await writeFile('todos.json', JSON.stringify([{title: questions.title}]));
    }
    else{
        const file = await readFile('todos.json', 'utf-8');
        const data = await JSON.parse(file);

        console.log(file);
        console.log(data);

        await data.push({title: questions.title});

        await writeFile('todos.json', JSON.stringify(data));
    }
    console.log(`A todo named "${questions.title}" has been sucessfully created!`);
}
if(command === 'list'){
    if(!existsSync('todos.json')){
        console.log('Cannot find todos file!')
    }
    else {
        const file = await readFile('todos.json', 'utf-8');
        const data = await JSON.parse(file);
        
        let todosString = data.map((todo: any, index: number) => `${index + 1}) ${todo.title}`).join('\n');
        console.log(`Todos: \n ${todosString}`);
    }
}